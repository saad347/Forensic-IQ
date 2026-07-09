import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "const updatedHistory = [...user.history.filter(h => h.caseId !== activeCase.id), newSession];",
  "const updatedHistory = [...user.history, newSession];"
);

fs.writeFileSync('src/App.tsx', content);
