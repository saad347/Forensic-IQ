import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Find the duplicated setTimeout block that was left over
const badBlockStart = '    setTimeout(() => {\n      const newSession: CompletedCaseSession = {';
const badBlockEnd = '    }, 1100); // realistic high-tech diagnostic simulation delay\n  };';

let startIndex = content.indexOf(badBlockStart);
if (startIndex !== -1) {
  let endIndex = content.indexOf(badBlockEnd, startIndex) + badBlockEnd.length;
  content = content.substring(0, startIndex) + content.substring(endIndex);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Fixed App.tsx duplicate setTimeout");
} else {
  console.log("Could not find bad block");
}
