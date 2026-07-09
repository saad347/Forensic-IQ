const fs = require('fs');
const content = fs.readFileSync('src/components/CaseLibrary.tsx', 'utf8');

const lines = content.split('\n');
let divBalance = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const open = (line.match(/<div(\s|>)/g) || []).length;
  const close = (line.match(/<\/div>/g) || []).length;
  divBalance += open - close;
  if (open !== close) {
    // console.log(\`Line \${i+1}: Balance \${divBalance} | \${line.trim()}\`);
  }
}
console.log('Final balance:', divBalance);

// Let's print out all lines with their running balance.
let balance = 0;
for(let i=0; i<lines.length; i++) {
    const open = (lines[i].match(/<div(\s|>)/g) || []).length;
    const close = (lines[i].match(/<\/div>/g) || []).length;
    balance += open - close;
    if(balance < 0) console.log("NEGATIVE BALANCE AT LINE", i+1);
}

