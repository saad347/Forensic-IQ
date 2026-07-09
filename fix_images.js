import fs from 'fs';

let content = fs.readFileSync('src/data/cases.ts', 'utf8');

const placeholderSvg = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='100%25' height='100%25' fill='%23e0e0e0'/%3E%3Cpath d='M 200 200 L 600 200 M 350 150 L 450 250' stroke='%23777' stroke-width='4' fill='none'/%3E%3Ctext x='400' y='50' font-family='sans-serif' font-size='20' text-anchor='middle' fill='%23555'%3E[OFFLINE EVIDENCE RENDER]%3C/text%3E%3C/svg%3E`;

// replace all imageUrl that start with http
content = content.replace(/imageUrl: 'https?:\/\/[^']+'/g, `imageUrl: "${placeholderSvg}"`);

fs.writeFileSync('src/data/cases.ts', content);
