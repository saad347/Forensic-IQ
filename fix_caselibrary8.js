import fs from 'fs';
let content = fs.readFileSync('src/components/CaseLibrary.tsx', 'utf8');

content = content.replace("                      </div>\n                    );", "                      </div>\n                      </div>\n                    );");

fs.writeFileSync('src/components/CaseLibrary.tsx', content);
