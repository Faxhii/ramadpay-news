import fs from 'fs';
import path from 'path';

const file = 'src/data/newsData.ts';
let content = fs.readFileSync(file, 'utf8');

// The file exports `export const newsArticles: Article[] = [...]`
// It's a bit tricky to parse without executing, but since it's valid TS we can do string replacements or regex.
// However, the easiest way is to use regex for published_at and [date].

// 1. Replace "published_at": "2026-07-01T..." with a date close to today (July 3)
// Let's just generate a time within the last 24 hours for each article.
let timeOffset = 0;
content = content.replace(/"published_at":\s*"[^"]+"/g, () => {
    // Current date is 2026-07-03. Let's make it 2026-07-03 with some hours offset.
    const date = new Date(Date.now() - timeOffset * 3600000); // subtract hours
    timeOffset += 1; // spread them out
    return `"published_at": "${date.toISOString()}"`;
});

// 2. Replace [date] with "July 2"
content = content.replace(/\[date\]/g, 'July 2');
content = content.replace(/\[insert date\]/gi, 'July 2');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed dates and placeholders in newsData.ts');
