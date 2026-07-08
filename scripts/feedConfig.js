/**
 * feedConfig.js
 * Central registry of all Somali news RSS sources.
 * Add/remove sources here — the pipeline in fetchNews.js picks them up automatically.
 * Run date of audit: 2026-07-08
 */

export const RSS_FEEDS = [
  {
    name: 'Radio Dalsan',
    url: 'https://radiodalsan.com/feed/',
    language: 'en',
    active: true,
    notes: 'English, leading Somalia news site, very active'
  },
  {
    name: 'Somalia Guardian',
    url: 'https://www.somaliguardian.com/feed/',
    language: 'en',
    active: true,
    notes: 'English, real-time news, active'
  },
  {
    name: 'Radio Ergo',
    url: 'https://radioergo.org/en/feed/',
    language: 'en',
    active: true,
    notes: 'English, humanitarian/community focus, IMS-funded'
  },
  {
    name: 'Horseed Media',
    url: 'https://horseedmedia.net/feed/',
    language: 'en',
    active: true,
    notes: 'Somali/English, very active as of today'
  },
  {
    name: 'Goobjoog',
    url: 'https://goobjoog.com/feed/',
    language: 'so',
    active: true,
    notes: 'Somali language, hourly updates, wide coverage'
  },
  {
    name: 'Halbeeg',
    url: 'https://halbeeg.com/feed/',
    language: 'so',
    active: true,
    stale: true,
    notes: 'Somali language — WARNING: Last RSS update was Nov 2024. Included in case they resume.'
  },
];

/**
 * Sources confirmed to have NO RSS feed available.
 * Documented here for transparency and future follow-up.
 * Do NOT scrape these — add them only when a feed URL becomes available.
 */
export const NO_RSS_SOURCES = [
  {
    name: 'Hiiraan Online',
    url: 'https://www.hiiraan.com',
    reason: 'Custom CMS with no discoverable RSS feed endpoint (/feed, /rss all return 404)',
    action: 'Flag for content partnership outreach'
  },
  {
    name: 'Garowe Online',
    url: 'https://www.garoweonline.com',
    reason: 'Custom CMS — /feed returns 404, /rss.xml returns 500, no <link rel="alternate"> in HTML head',
    action: 'Flag for content partnership outreach'
  },
  {
    name: 'SONNA',
    url: 'https://sonna.so',
    reason: 'Next.js SPA — sonna.so/feed returns rendered 404 page, no RSS endpoint found',
    action: 'Contact official agency for syndication agreement'
  },
  {
    name: 'Shabelle.net',
    url: 'https://www.shabelle.net',
    reason: 'Feed URL (shabelle.net/feed) exists and returns 200 but content is empty',
    action: 'Monitor — may resume publishing to RSS'
  },
];
