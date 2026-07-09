const fs = require('fs');
const content = fs.readFileSync('src/components/CaseLibrary.tsx', 'utf8');
const lines = content.split('\n');
let balance = 0;
for(let i=0; i<lines.length; i++) {
    const open = (lines[i].match(/<div(\s|>)/g) || []).length;
    const close = (lines[i].match(/<\/div>/g) || []).length;
    balance += open - close;
    console.log(`L${i+1} B${balance}: ${lines[i].trim()}`);
}
