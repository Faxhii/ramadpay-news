const fs = require('fs');
const file = 'src/data/newsData.ts';
let content = fs.readFileSync(file, 'utf8');

const images = [
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1526470608118-44a1911edfea?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1612831455740-a2f6212eeeb2?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1580128660010-fdcb27678f28?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
];

let i = 0;
content = content.replace(/"image_url":\s*"[^"]+"/g, () => {
  const url = images[i % images.length];
  i++;
  return `"image_url": "${url}"`;
});

fs.writeFileSync(file, content, 'utf8');
console.log('Images fixed');
