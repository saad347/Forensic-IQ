import fs from 'fs';

let content = fs.readFileSync('src/data/cases.ts', 'utf8');

// We will use a regex to replace the redHerring: false, shortSummary: '...' with redHerring: false, supportsCauseIds: ['...'], shortSummary: '...'
// First, we can split by "correctCauseId: '" to know the current correct cause.

let parts = content.split('correctCauseId: \'');
let newContent = parts[0];

for (let i = 1; i < parts.length; i++) {
    let part = parts[i];
    let correctCauseId = part.substring(0, part.indexOf('\''));
    
    // Now replace redHerring: false in this part
    let regex = /(redHerring:\s*false,)(\s*shortSummary:)/g;
    
    part = part.replace(regex, `$1 supportsCauseIds: ['${correctCauseId}'], redHerringExplanation: undefined,$2`);
    
    newContent += `correctCauseId: '${part}`;
}

fs.writeFileSync('src/data/cases.ts', newContent);
console.log("Updated cases.ts");
