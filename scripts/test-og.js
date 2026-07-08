import { XMLParser } from 'fast-xml-parser';
fetch('https://goobjoog.com/feed/')
  .then(r => r.text())
  .then(xml => {
    const parser = new XMLParser();
    const parsed = parser.parse(xml);
    const firstItem = parsed.rss.channel.item[0];
    console.log("Title:", firstItem.title);
    console.log("Description snippet:", firstItem.description.substring(0, 200));
    console.log("Content:encoded snippet:", (firstItem['content:encoded'] || "none").substring(0, 200));
  });
