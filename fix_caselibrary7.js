import fs from 'fs';
let content = fs.readFileSync('src/components/CaseLibrary.tsx', 'utf8');

// I will write a simple script to count <div> and </div> tags in the component.
let divOpen = (content.match(/<div(\s|>)/g) || []).length;
let divClose = (content.match(/<\/div>/g) || []).length;
console.log('Open:', divOpen, 'Close:', divClose);
