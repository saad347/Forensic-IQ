import fs from 'fs';
let content = fs.readFileSync('src/components/CaseLibrary.tsx', 'utf8');

// replace the map header
const mapHeaderOld = "                  {group.map((c) => {\n                    const isCompleted = completedIds.includes(c.id);\n                    const historyEntry = user.history.find(h => h.caseId === c.id);\n                    const wasCorrect = historyEntry?.correct;";
const mapHeaderNew = `                  {group.map((c) => {
                    const attempts = user.history.filter(h => h.caseId === c.id);
                    const attemptCount = attempts.length;
                    const bestScore = attemptCount > 0 ? Math.max(...attempts.map(a => a.score)) : 0;
                    const isCompleted = attemptCount > 0;
                    const bestEntry = attempts.find(a => a.score === bestScore);
                    const wasCorrect = bestEntry?.correct;`;

content = content.replace(mapHeaderOld, mapHeaderNew);

// Replace "SOLVED [Score: {historyEntry?.score}]"
content = content.replace("SOLVED [Score: {historyEntry?.score}]", "PERSONAL BEST: {bestScore} | ATTEMPTS: {attemptCount}");

// Replace "UNSOLVED"
content = content.replace("UNSOLVED", "UNSOLVED | ATTEMPTS: {attemptCount}");

// Remove the duplicate Export button
const duplicateExport = `                          <button
                            onClick={(e) => { e.stopPropagation(); handleExport(c); }}
                            className="w-full md:w-auto px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] flex items-center justify-center space-x-1.5 transition-all border border-[#121212]/30 text-[#121212]/70 hover:bg-[#121212]/5 hover:text-[#121212] bg-white"
                          >
                            <span>Export Case</span>
                          </button>`;
content = content.replace(duplicateExport, "");

fs.writeFileSync('src/components/CaseLibrary.tsx', content);
