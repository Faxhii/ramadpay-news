/**
 * Ramadpay News Integration Architecture & API Reference
 * 
 * This file serves as the developer blueprint and system integration map
 * for connecting the front-end layout to automated backend ingestion.
 */

// Bypass browser environment node types checks
declare const process: { env: Record<string, string | undefined> };

// 1. CONTENT SCHEMA SPECIFICATION
export interface IngestedArticlePayload {
  title: string;
  slug: string;
  summary: string;
  content: string;
  source: string;
  country: 'Somalia' | 'Kenya' | 'Ethiopia';
  category: 'Politics' | 'Economy' | 'Security' | 'Society' | 'Regional';
  published_at: string; // ISO 8601 String
  update_batch: 'morning' | 'afternoon';
  image_url: string;
  featured: boolean;
  ai_summary_points: string[];
}

// ==========================================
// 2. DEEPSEEK-V3 API SYNTHESIS HANDLERS
// ==========================================

export const deepSeekConfig = {
  apiKey: process.env.DEEPSEEK_API_KEY || 'sk-deepseek-...',
  baseURL: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat', // DeepSeek-V3
};

/**
 * Summarization System Prompt:
 * Instructs DeepSeek V3 to output a concise summary and 5 key bullet takeaways.
 */
export const SUMMARIZATION_PROMPT = `
You are an expert editorial editor specializing in East African regional dynamics.
Your task is to analyze the provided raw article text and produce a clean, structured JSON response.

Requirements:
1. Provide a concise editorial dek (1-2 sentences) summarizing the report.
2. Formulate exactly 5 authoritative, high-impact bullet takeaways. Each bullet must be self-contained and convey strategic facts.
3. Classify the article into one of these categories: Politics, Economy, Security, Society, Regional.
4. Keep the writing style premium, calm, editorial, and objective.

Your response MUST be valid JSON matching this schema:
{
  "summary": "String (the editorial dek)",
  "ai_summary_points": ["String", "String", "String", "String", "String"],
  "category": "Politics" | "Economy" | "Security" | "Society" | "Regional"
}
`;

/**
 * Mock function demonstrating the DeepSeek API calling code.
 * Developers can drop this directly into their serverless functions (Next.js API route, AWS Lambda).
 */
export async function summarizeArticleWithDeepSeek(rawText: string): Promise<Partial<IngestedArticlePayload>> {
  try {
    const response = await fetch(`${deepSeekConfig.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepSeekConfig.apiKey}`
      },
      body: JSON.stringify({
        model: deepSeekConfig.model,
        messages: [
          { role: 'system', content: SUMMARIZATION_PROMPT },
          { role: 'user', content: `Please synthesize this article text:\n\n${rawText}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1 // Low temperature for high objectivity
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API returned error status: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      summary: result.summary,
      ai_summary_points: result.ai_summary_points,
      category: result.category
    };
  } catch (error) {
    console.error('DeepSeek Summarization Failed:', error);
    throw error;
  }
}

// ==========================================
// 3. INGESTION PIPELINE (FIRECRAWL / SCRAPER)
// ==========================================

export const scraperConfig = {
  sources: {
    somalia: ['https://www.hiiraan.com', 'https://shabellemedia.com'],
    kenya: ['https://nation.africa', 'https://www.capitalfm.co.ke'],
    ethiopia: ['https://addisstandard.com', 'https://www.addisherald.com']
  }
};

/**
 * Ingests raw news feed by crawling targeted RSS / HTML sources.
 * Employs Firecrawl API to extract high-quality, markdown content from raw URLs.
 */
export async function runIngestionPipeline(country: 'Somalia' | 'Kenya' | 'Ethiopia') {
  console.log(`[scraper] Starting ingestion cycle for ${country} bureau...`);
  
  // Example Firecrawl endpoint invocation
  const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
    },
    body: JSON.stringify({
      url: scraperConfig.sources[country.toLowerCase() as 'somalia' | 'kenya' | 'ethiopia'][0],
      pageOptions: {
        onlyMainContent: true
      }
    })
  });

  const rawMarkdown = await firecrawlResponse.json();
  console.log(`[scraper] Raw content extracted (${JSON.stringify(rawMarkdown).length} bytes). Invoking DeepSeek for structured output...`);
  
  // Next step in pipeline:
  // const structuredNews = await summarizeArticleWithDeepSeek(rawMarkdown.data.content);
}

// ==========================================
// 4. SCHEDULED JOBS (CRON SERVICE)
// ==========================================

/**
 * Ingestion intervals for cron jobs:
 * 
 * Morning Batch Ingestion (published at 06:30 EAT):
 * cron trigger: "30 6 * * *"
 * Target: Scrapes over-night items, tags as update_batch = "morning".
 * 
 * Afternoon Batch Ingestion (published at 16:00 EAT):
 * cron trigger: "0 16 * * *"
 * Target: Scrapes midday developments, tags as update_batch = "afternoon".
 */
export const cronJobs = [
  {
    name: 'Morning Digest Generation',
    cronExpression: '30 6 * * *',
    action: async () => {
      console.log('[cron] Running morning news synthesis...');
      await runIngestionPipeline('Somalia');
      await runIngestionPipeline('Kenya');
      await runIngestionPipeline('Ethiopia');
      console.log('[cron] Morning roundup compiled successfully.');
    }
  },
  {
    name: 'Afternoon Digest Generation',
    cronExpression: '0 16 * * *',
    action: async () => {
      console.log('[cron] Running afternoon news synthesis...');
      await runIngestionPipeline('Somalia');
      await runIngestionPipeline('Kenya');
      await runIngestionPipeline('Ethiopia');
      console.log('[cron] Afternoon roundup compiled successfully.');
    }
  }
];

// ==========================================
// 5. NOTIFICATION & DISTRIBUTION WEBHOOKS
// ==========================================

export const whatsappConfig = {
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  sandboxNumber: 'whatsapp:+14155238886', // Standard Sandbox
  broadcastGroupSid: process.env.WHATSAPP_BROADCAST_GROUP_ID
};

/**
 * Triggers WhatsApp Message Broadcast with bulleted takeaways.
 */
export async function broadcastBriefingToWhatsApp(batch: 'morning' | 'afternoon', articles: IngestedArticlePayload[]) {
  console.log(`[broadcast] Formatting WhatsApp push for ${batch} briefing...`);
  
  // Compose messaging template
  let textBody = `*Ramadpay News | ${batch.toUpperCase()} BRIEFING*\n`;
  textBody += `Synthesized at ${batch === 'morning' ? '06:30' : '16:00'} EAT\n\n`;
  
  articles.forEach((art, idx) => {
    textBody += `*${idx + 1}. ${art.title}*\n`;
    textBody += `• ${art.ai_summary_points[0]}\n`;
    textBody += `• Read: https://lastaherald.com/news/${art.slug}\n\n`;
  });

  textBody += `_Reply STOP to unsubscribe_`;

  // Example Twilio client call:
  /*
  const twilio = require('twilio');
  const client = twilio(whatsappConfig.twilioAccountSid, whatsappConfig.twilioAuthToken);
  
  await client.messages.create({
    body: textBody,
    from: whatsappConfig.sandboxNumber,
    to: 'whatsapp:+254700000000' // Target subscriber
  });
  */
  
  console.log(`[broadcast] WhatsApp message size: ${textBody.length} chars. Message broadcast completed.`);
}
