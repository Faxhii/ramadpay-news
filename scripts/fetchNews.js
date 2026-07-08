/**
 * fetchNews.js — RSS-based News Aggregation Pipeline
 * 
 * Pipeline:
 *   1. Fetch all RSS feeds from feedConfig.js
 *   2. Parse items: title, link, pubDate, description, enclosure/media:content image
 *   3. For items without a feed image, fetch article HTML head only → og:image
 *   4. Deduplicate by URL, then by fuzzy title match
 *   5. Drop articles older than 72 hours
 *   6. Send title + description to DeepSeek → generate original 4-6 paragraph article
 *   7. Archive: prepend new to existing, keep last 500, cap homepage to 48h window
 *   8. Write output to src/data/newsData.ts
 *   9. Log run statistics
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';
import { generateObject } from 'ai';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { z } from 'zod';
import { RSS_FEEDS, NO_RSS_SOURCES } from './feedConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.DEEPSEEK_API_KEY;

if (!API_KEY) {
  console.error('[FATAL] DEEPSEEK_API_KEY is missing from .env. Aborting.');
  process.exit(1);
}

const deepseek = createDeepSeek({ apiKey: API_KEY });

// Max article age before dropping from pipeline
const MAX_ARTICLE_AGE_HOURS = 24;
// Max articles to keep in archive (full file)
const MAX_ARCHIVE_ARTICLES = 500;
// Max new articles to summarize per run (keeps DeepSeek costs bounded)
const MAX_NEW_PER_RUN = 25;

// ─── Category fallback images (generic landscapes, NOT AI-generated events) ───
const CATEGORY_FALLBACKS = {
  Politics:  'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
  Economy:   'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800',
  Security:  'https://images.unsplash.com/photo-1517594422361-5e1f09310fa6?auto=format&fit=crop&q=80&w=800',
  Society:   'https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?auto=format&fit=crop&q=80&w=800',
  Regional:  'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800',
  Health:    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
  Education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
  Technology:'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Strip HTML tags from a string */
function stripHtml(str = '') {
  return str.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
}

/** Simple Levenshtein distance for fuzzy title dedup */
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

/** Fuzzy-match two titles — true if they are likely the same story */
function isSameStory(titleA, titleB) {
  const a = titleA.toLowerCase().trim();
  const b = titleB.toLowerCase().trim();
  if (a === b) return true;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return true;
  const dist = levenshtein(a.substring(0, 80), b.substring(0, 80));
  return dist / Math.max(a.length, b.length, 1) < 0.2; // 20% edit distance threshold
}

/** Fetch an RSS feed and return parsed items */
async function fetchFeed(feed) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '_',
    allowBooleanAttributes: true,
  });

  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'RamadpayNews/1.0 RSS Reader (contact: admin@ramadpay.us)' },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.warn(`  [${feed.name}] HTTP ${res.status} — skipping`);
      return { feed, items: [], error: `HTTP ${res.status}` };
    }

    const xml = await res.text();
    const parsed = parser.parse(xml);
    const channel = parsed?.rss?.channel;

    if (!channel) {
      console.warn(`  [${feed.name}] No <channel> found in RSS — skipping`);
      return { feed, items: [], error: 'No channel in RSS' };
    }

    const rawItems = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : [];
    const items = rawItems.map(item => {
      // Image priority: 1) enclosure, 2) media:content, 3) first <img> in content:encoded
      let imageUrl = null;
      if (item.enclosure && item.enclosure._url) {
        imageUrl = item.enclosure._url;
      } else if (item['media:content'] && item['media:content']._url) {
        imageUrl = item['media:content']._url;
      } else {
        // Extract first real <img src> from the article's full content HTML
        const contentHtml = (typeof item['content:encoded'] === 'string' ? item['content:encoded'] : '') ||
                            (typeof item.description === 'string' ? item.description : '');
        const imgMatch = contentHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch && imgMatch[1] && imgMatch[1].startsWith('http')) {
          imageUrl = imgMatch[1];
        }
      }

      const rawContent = typeof item['content:encoded'] === 'string' ? item['content:encoded'] : '';
      const rawDesc = typeof item.description === 'string' ? item.description : '';

      return {
        title:       stripHtml(item.title || ''),
        link:        item.link || item.guid || '',
        pubDate:     item.pubDate || item['dc:date'] || null,
        description: stripHtml(rawContent || rawDesc).substring(0, 600),
        imageUrl,
        sourceName:  feed.name,
      };
    }).filter(item => item.title && item.link);

    console.log(`  [${feed.name}] ${items.length} items fetched`);
    return { feed, items, error: null };

  } catch (err) {
    console.warn(`  [${feed.name}] Error: ${err.message}`);
    return { feed, items: [], error: err.message };
  }
}

/** Fetch only the HTML <head> of an article URL and extract og:image */
async function fetchOgImage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'RamadpayNews/1.0 RSS Reader' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    // Read up to 128KB — enough to find <head> og:image and first body <img> even with large inline CSS
    const reader = res.body.getReader();
    let html = '';
    while (html.length < 131072) {
      const { done, value } = await reader.read();
      if (done) break;
      html += new TextDecoder().decode(value);
    }
    reader.cancel().catch(() => {});

    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
                || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (match && match[1]) {
      return match[1].replace(/&amp;/g, '&');
    }

    // Fallback: If no og:image, look for the first standard <img src> in the HTML body
    const imgRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      if (imgMatch[1] && !isGenericImage(imgMatch[1])) {
        return imgMatch[1]; // Return the first non-generic image
      }
    }

    return null;
  } catch {
    return null;
  }
}

/** Check if an image URL looks like a logo/icon (not a real photo) */
function isGenericImage(url = '') {
  if (!url) return true;
  // Explicit keyword patterns in the URL path
  if (/logo|icon|favicon|placeholder|default|cropped-.*32x32|avatar|brand|og-image|ogimage|og_image|share-image|social-image|site-image|header-image|no-image|noimage/i.test(url)) return true;
  // Images that are clearly square thumbnails (logos tend to be tiny squares)
  if (/[_-](32x32|64x64|128x128|192x192|144x144)[._]/i.test(url)) return true;
  return false;
}

/** Returns true if the URL is a tag, category, topic, or archive page (not a real article) */
function isIndexPage(url = '') {
  return /\/(tags?|category|categories|topics?|tag|archive|section|search)\//i.test(url);
}

// ─── Main pipeline ───────────────────────────────────────────────────────────

async function run() {
  const runStart = new Date();
  console.log(`\n══════════════════════════════════════════`);
  console.log(`  Ramadpay RSS Pipeline — ${runStart.toISOString()}`);
  console.log(`══════════════════════════════════════════\n`);

  // Log no-RSS sources for transparency
  console.log('Sources with NO RSS feed (skipped — no scraping):');
  NO_RSS_SOURCES.forEach(s => console.log(`  ✗ ${s.name}: ${s.reason}`));
  console.log('');

  // ── Step 1: Fetch all feeds ──────────────────────────────────────────────
  console.log('Fetching RSS feeds...');
  const feedResults = await Promise.all(RSS_FEEDS.map(fetchFeed));

  const runLog = {
    runAt: runStart.toISOString(),
    feeds: feedResults.map(r => ({
      name: r.feed.name,
      itemsFetched: r.items.length,
      error: r.error,
    })),
    itemsAdded: 0,
    itemsDropped: 0,
    itemsSkipped: 0,
  };

  // ── Step 2: Pool all items ───────────────────────────────────────────────
  let allItems = feedResults.flatMap(r => r.items);
  console.log(`\nTotal items across all feeds: ${allItems.length}`);

  // ── Step 3: Freshness filter — drop items older than MAX_ARTICLE_AGE_HOURS ──
  const cutoff = new Date(Date.now() - MAX_ARTICLE_AGE_HOURS * 60 * 60 * 1000);
  const freshItems = allItems.filter(item => {
    if (!item.pubDate) return true; // keep if no date (can't tell)
    const d = new Date(item.pubDate);
    return isNaN(d.getTime()) || d >= cutoff;
  });
  const droppedByAge = allItems.length - freshItems.length;
  console.log(`Dropped ${droppedByAge} items older than ${MAX_ARTICLE_AGE_HOURS}h. ${freshItems.length} remain.`);

  // ── Step 4: Load existing articles ──────────────────────────────────────
  const outPath = path.join(__dirname, '../src/data/newsData.ts');
  let existingArticles = [];
  try {
    if (fs.existsSync(outPath)) {
      const fileContent = fs.readFileSync(outPath, 'utf-8');
      const match = fileContent.match(/export const newsArticles: Article\[\] = (\[.*\]);/s);
      if (match && match[1]) {
        existingArticles = JSON.parse(match[1]);
      }
    }
  } catch (e) {
    console.warn('Could not parse existing articles — starting fresh.', e.message);
  }

  const existingUrls = new Set(existingArticles.map(a => a.original_url).filter(Boolean));
  const existingTitles = existingArticles.map(a => a.original_title || a.title);

  // ── Step 5: Deduplicate ──────────────────────────────────────────────────
  const seenUrls = new Set();
  const dedupedItems = [];

  for (const item of freshItems) {
    // Exact URL dedup
    if (existingUrls.has(item.link) || seenUrls.has(item.link)) {
      runLog.itemsSkipped++;
      continue;
    }
    // Fuzzy title dedup against existing articles
    const isDupe = existingTitles.some(t => isSameStory(t, item.title)) ||
                   dedupedItems.some(d => isSameStory(d.title, item.title));
    if (isDupe) {
      runLog.itemsSkipped++;
      continue;
    }
    seenUrls.add(item.link);
    dedupedItems.push(item);
  }

  console.log(`After dedup: ${dedupedItems.length} genuinely new items (${runLog.itemsSkipped} dupes skipped)`);

  // ── Step 6: Cap new items per run ────────────────────────────────────────
  const itemsToProcess = dedupedItems.slice(0, MAX_NEW_PER_RUN);
  console.log(`Processing up to ${MAX_NEW_PER_RUN}: will summarize ${itemsToProcess.length} items\n`);

  // ── Step 7: Image resolution + AI article generation ────────────────────
  const newArticles = [];

  for (let i = 0; i < itemsToProcess.length; i++) {
    const item = itemsToProcess[i];
    console.log(`[${i+1}/${itemsToProcess.length}] ${item.sourceName}: ${item.title.substring(0, 70)}...`);

    try {
      // Image resolution (in priority order)
      let imageUrl = null;

      // 1. RSS enclosure / media:content (safest — publisher explicitly syndicated it)
      if (item.imageUrl && !isGenericImage(item.imageUrl)) {
        imageUrl = item.imageUrl;
        console.log(`  ✓ Image from RSS feed`);
      }

      // 2. og:image from the real article HTML head
      // Skip this step entirely if the RSS link is a tag/category/topic page —
      // those pages always return a generic site-logo og:image, not an article photo.
      if (!imageUrl) {
        if (isIndexPage(item.link)) {
          console.log(`  → Skipping og:image — URL is a tag/category page, not a real article`);
        } else {
          console.log(`  → No feed image, fetching og:image from article...`);
          const ogImage = await fetchOgImage(item.link);
          if (ogImage && !isGenericImage(ogImage)) {
            imageUrl = ogImage;
            console.log(`  ✓ og:image found: ${ogImage.substring(0, 80)}`);
          } else if (ogImage) {
            console.log(`  → og:image looks generic/logo, skipping it`);
          } else {
            console.log(`  → No og:image found`);
          }
        }
      }

      // 3. Category fallback (generic landscape — NOT AI-generated event depiction)
      // We don't know category yet, use Politics as safe default; will be set after AI call
      // We'll assign the real category fallback after the AI call below

      // AI article generation
      console.log(`  → Generating article via DeepSeek...`);
      const rawText = `Title: ${item.title}\nSource: ${item.sourceName} (${item.link})\nContent: ${item.description}`;

      const { object } = await generateObject({
        model: deepseek('deepseek-chat'),
        system: `You are a senior editor for Ramadpay Daily News, a news platform for the Somali diaspora. 
You write original, factual, neutral news briefs. 
NEVER use sensationalized language (no SHOCKING, EXPLOSIVE, etc.). 
NEVER closely mirror the source's phrasing — this must be independent writing.
Always end with an attribution line.`,
        prompt: `Using the source material below as factual reference only, write an original 4-6 paragraph news brief that:
- States the core facts (who/what/where/when) in your own words
- Adds relevant context: what led up to this event, key figures involved
- Explains why this matters for the Somali diaspora specifically
- Uses a neutral, factual tone — no sensationalized language
- Does NOT closely mirror the sentence structure or phrasing of the source
- Ends with the exact line: "Read the original report from ${item.sourceName} here: ${item.link}"

Source material (facts only, do not copy phrasing):
${rawText}`,
        schema: z.object({
          headline:          z.string().describe('Clear, factual news headline (max 100 chars). No clickbait.'),
          summary:           z.string().describe('1-2 sentence neutral summary for the article card'),
          body_text:         z.string().describe('Full 4-6 paragraph original article ending with attribution line'),
          category:          z.enum(['Politics', 'Economy', 'Security', 'Society', 'Regional', 'Health', 'Education', 'Technology']),
          ai_summary_points: z.array(z.string()).length(4).describe('Exactly 4 factual bullet points'),
        })
      });

      // Assign category fallback now that we have the category
      if (!imageUrl) {
        imageUrl = CATEGORY_FALLBACKS[object.category] || CATEGORY_FALLBACKS.Politics;
        console.log(`  ✓ Using category fallback image for ${object.category}`);
      }

      const slug = object.headline.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();

      newArticles.push({
        id: `news-${Date.now()}-${i}`,
        title: object.headline,
        original_title: item.title,
        slug,
        summary: object.summary,
        content: object.body_text,
        source: new URL(item.link).hostname.replace('www.', ''),
        source_name: item.sourceName,
        original_url: item.link,
        country: 'Somalia',
        category: object.category,
        published_at: pubDate,
        first_seen_at: new Date().toISOString(),
        update_batch: new Date().getHours() < 12 ? 'morning' : 'afternoon',
        image_url: imageUrl,
        featured: false,
        ai_summary_points: object.ai_summary_points,
      });

      console.log(`  ✓ Done — ${object.category}`);

    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }

    // Respectful delay between DeepSeek calls
    await new Promise(r => setTimeout(r, 1200));
  }

  runLog.itemsAdded = newArticles.length;
  console.log(`\nGenerated ${newArticles.length} new articles.`);

  // ── Step 8: Archive cleanup — drop existing articles older than 72h ──────
  const archiveCutoff = new Date(Date.now() - MAX_ARTICLE_AGE_HOURS * 60 * 60 * 1000);
  const survivingExisting = existingArticles.filter(a => {
    if (!a.first_seen_at) return true; // keep legacy articles without timestamp
    return new Date(a.first_seen_at) >= archiveCutoff;
  });
  runLog.itemsDropped = existingArticles.length - survivingExisting.length;
  console.log(`Cleanup: dropped ${runLog.itemsDropped} articles older than ${MAX_ARTICLE_AGE_HOURS}h from archive.`);

  // ── Step 9: Combine, dedupe, cap, set featured ───────────────────────────
  let combined = [...newArticles, ...survivingExisting];

  // Final dedup by URL
  const seenFinalUrls = new Set();
  combined = combined.filter(a => {
    if (!a.original_url) return true;
    if (seenFinalUrls.has(a.original_url)) return false;
    seenFinalUrls.add(a.original_url);
    return true;
  });

  combined = combined.slice(0, MAX_ARCHIVE_ARTICLES);
  if (combined.length > 0) {
    combined.forEach(a => a.featured = false);
    combined[0].featured = true;
  }

  // ── Step 10: Write output ────────────────────────────────────────────────
  const interfaceBlock = `// Auto-generated by fetchNews.js (RSS + DeepSeek pipeline)
// Run at: ${runStart.toISOString()}
// Sources: ${RSS_FEEDS.filter(f => f.active).map(f => f.name).join(', ')}

export interface Article {
  id: string;
  title: string;
  original_title?: string;
  slug: string;
  summary: string;
  content: string;
  source: string;
  source_name?: string;
  original_url?: string;
  country: string;
  category: string;
  published_at: string;
  first_seen_at?: string;
  update_batch: 'morning' | 'afternoon';
  image_url: string;
  featured: boolean;
  ai_summary_points: string[];
}

export const newsArticles: Article[] = ${JSON.stringify(combined, null, 2)};
`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, interfaceBlock);
  console.log(`\nWrote ${combined.length} articles to src/data/newsData.ts`);

  // ── Step 11: Print run log ───────────────────────────────────────────────
  console.log('\n──── Run Summary ─────────────────────────────');
  runLog.feeds.forEach(f => {
    const status = f.error ? `✗ ERROR: ${f.error}` : `✓ ${f.itemsFetched} items`;
    console.log(`  ${f.name.padEnd(20)} ${status}`);
  });
  console.log(`  ${'New articles added:'.padEnd(20)} ${runLog.itemsAdded}`);
  console.log(`  ${'Dupes skipped:'.padEnd(20)} ${runLog.itemsSkipped}`);
  console.log(`  ${'Old articles dropped:'.padEnd(20)} ${runLog.itemsDropped}`);
  console.log(`  ${'Archive total:'.padEnd(20)} ${combined.length}`);
  console.log('──────────────────────────────────────────────\n');
}

run().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
