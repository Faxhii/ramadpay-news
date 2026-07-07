import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FirecrawlApp from '@mendable/firecrawl-js';
import { generateObject } from 'ai';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.DEEPSEEK_API_KEY;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

const deepseek = createDeepSeek({
  apiKey: API_KEY,
});

const categoryImages = {
  Politics: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800",
  Economy: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
  Security: "https://images.unsplash.com/photo-1517594422361-5e1f09310fa6?auto=format&fit=crop&q=80&w=800",
  Society: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?auto=format&fit=crop&q=80&w=800",
  Regional: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800",
  Health: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800",
  Education: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
  Technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
};

async function run() {
  if (!API_KEY || !FIRECRAWL_API_KEY) {
    console.error('Missing API keys in .env');
    return;
  }

  const app = new FirecrawlApp({ apiKey: FIRECRAWL_API_KEY });
  console.log('Searching for Somali political news across multiple queries...');

  const allQueries = [
    "Somalia breaking news today",
    "Somali diaspora community news",
    "Somalia economic development and business news",
    "Mogadishu security updates past 24 hours",
    "Somaliland politics and elections news",
    "Puntland regional news today",
    "Somalia humanitarian aid and health news",
    "Horn of Africa geopolitics Somalia",
    "Somalia technology and education news",
    "Somali sports and culture news"
  ];

  // Randomly select 3 queries, and always include a Facebook query to get latest from Facebook
  const shuffledQueries = allQueries.sort(() => 0.5 - Math.random());
  const queries = ["site:facebook.com Somalia news today", ...shuffledQueries.slice(0, 3)];

  const searchPromises = queries.map(q => app.search(q, { limit: 15 }).catch(e => {
    console.error(`Search failed for '${q}':`, e.message);
    return null;
  }));
  
  const searchResultsArray = await Promise.all(searchPromises);
  
  const uniqueUrls = new Set();
  const pooledItems = [];
  
  for (const results of searchResultsArray) {
    if (!results) continue;
    const items = results.web ? results.web : results.data;
    for (const item of items) {
      if (!uniqueUrls.has(item.url)) {
        uniqueUrls.add(item.url);
        pooledItems.push(item);
      }
    }
  }

  console.log(`Found ${pooledItems.length} unique articles from search.`);

  const targetItems = pooledItems.slice(0, 30);
  const newArticles = [];

  for (let i = 0; i < targetItems.length; i++) {
    const item = targetItems[i];
    try {
      console.log(`[${i+1}/${targetItems.length}] Scraping: ${item.url}`);
      
      let fullText = item.description || "";
      let scrapedImageUrl = null;
      
      try {
        const scrapeResult = await app.scrapeUrl(item.url, { formats: ['markdown'] });
        
        // Handle both older and newer firecrawl-js versions
        const dataObj = scrapeResult.data || scrapeResult;
        
        if (dataObj && dataObj.markdown) {
          fullText = dataObj.markdown.substring(0, 3000);
          
          // Try to extract the first actual image from the markdown content (likely the article photo)
          const mdImageMatch = fullText.match(/!\[.*?\]\((https?:\/\/[^\s\)]+)\)/);
          if (mdImageMatch && mdImageMatch[1]) {
            scrapedImageUrl = mdImageMatch[1];
          }
        }
        
        // If no markdown image, fallback to og:image
        if (!scrapedImageUrl && dataObj && dataObj.metadata && dataObj.metadata.ogImage) {
          scrapedImageUrl = dataObj.metadata.ogImage;
        }
      } catch (e) {
        console.log(`[${i+1}] Firecrawl scrape failed, falling back. (${e.message})`);
      }

      // Native fetch fallback for og:image if missing
      if (!scrapedImageUrl) {
        try {
          const res = await fetch(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
          const html = await res.text();
          const match = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i);
          if (match && match[1]) {
            scrapedImageUrl = match[1];
            console.log(`[${i+1}] Extracted og:image natively: ${scrapedImageUrl}`);
          }
        } catch (e) {
          console.log(`[${i+1}] Native fetch for og:image failed:`, e.message);
        }
      }

      // Filter out generic logos or icons
      if (scrapedImageUrl && /logo|icon|default|empty|avatar/i.test(scrapedImageUrl)) {
        console.log(`[${i+1}] Filtered out generic logo image: ${scrapedImageUrl}`);
        scrapedImageUrl = null;
      }

      const rawText = `Title: ${item.title}\nSource: ${item.url}\nContent: ${fullText}`;

      console.log(`[${i+1}] Generating article via DeepSeek...`);
      const { object } = await generateObject({
        model: deepseek('deepseek-chat'),
        system: 'You are an expert editorial editor for East African news. Given this scraped web text about Somali politics, output structured data according to the schema.',
        prompt: rawText,
        schema: z.object({
          summary: z.string().describe('A 1 sentence editorial dek'),
          ai_summary_points: z.array(z.string()).length(4).describe('Exactly 4 string bullets of key facts'),
          category: z.enum(['Politics', 'Economy', 'Security', 'Society', 'Regional', 'Health', 'Education', 'Technology']),
          full_article: z.string().describe('A detailed, multi-paragraph editorial news story expanding on the facts with professional journalism style, at least 3-4 paragraphs long, separated by two newlines.')
        })
      });
      
      const finalImageUrl = scrapedImageUrl || categoryImages[object.category] || categoryImages['Society'];

      newArticles.push({
        id: `news-${Date.now()}-${i}`,
        title: item.title,
        slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        summary: object.summary,
        content: object.full_article,
        source: new URL(item.url).hostname.replace('www.', ''),
        original_url: item.url,
        country: 'Somalia',
        category: object.category,
        published_at: new Date().toISOString(),
        update_batch: new Date().getHours() < 12 ? 'morning' : 'afternoon',
        image_url: finalImageUrl,
        featured: false,
        ai_summary_points: object.ai_summary_points
      });

    } catch (err) {
      console.error(`[${i+1}] Failed to process:`, err.message);
    }
    
    // Quick delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  const validNewArticles = newArticles.slice(0, 20);
  console.log(`Generated ${validNewArticles.length} perfect new articles.`);
  
  // Archiving logic
  const outPath = path.join(__dirname, '../src/data/newsData.ts');
  let existingArticles = [];
  
  try {
    if (fs.existsSync(outPath)) {
      const fileContent = fs.readFileSync(outPath, 'utf-8');
      // Extremely basic extraction of the JSON array from the TS file
      const match = fileContent.match(/export const newsArticles: Article\[\] = (\[.*\]);/s);
      if (match && match[1]) {
        existingArticles = JSON.parse(match[1]);
      }
    }
  } catch (e) {
    console.error('Could not parse existing articles for archiving, starting fresh.', e.message);
  }

  // Prepend new articles, cap at 100
  let combinedArticles = [...validNewArticles, ...existingArticles];
  // Remove duplicates by title just in case
  const seenTitles = new Set();
  combinedArticles = combinedArticles.filter(a => {
    if (seenTitles.has(a.title)) return false;
    seenTitles.add(a.title);
    return true;
  });
  
  combinedArticles = combinedArticles.slice(0, 100);
  
  if (combinedArticles.length > 0) {
    combinedArticles.forEach(a => a.featured = false);
    combinedArticles[0].featured = true;
  }

  const output = `// Auto-generated by fetchNews.js (Firecrawl + DeepSeek + Zod + Archiving)\n\nexport interface Article {\n  id: string;\n  title: string;\n  slug: string;\n  summary: string;\n  content: string;\n  source: string;\n  original_url?: string;\n  country: string;\n  category: string;\n  published_at: string;\n  update_batch: 'morning' | 'afternoon';\n  image_url: string;\n  featured: boolean;\n  ai_summary_points: string[];\n}\n\nexport const newsArticles: Article[] = ${JSON.stringify(combinedArticles, null, 2)};\n`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, output);
  console.log(`Wrote ${combinedArticles.length} total articles to src/data/newsData.ts`);
}

run();
