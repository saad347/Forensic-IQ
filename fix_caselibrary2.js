import fs from 'fs';
let content = fs.readFileSync('src/components/CaseLibrary.tsx', 'utf8');

// Replace the isCompleted check and the score display
const regex = /const isCompleted = completedIds\.includes\(c\.id\);([\s\S]*?)<h3 className="font-serif italic text-2xl text-\[\#121212\]">/g;

content = content.replace(regex, (match, p1) => {
  return `const caseAttempts = user.history.filter(h => h.caseId === c.id);
                      const attemptCount = caseAttempts.length;
                      const bestScore = attemptCount > 0 ? Math.max(...caseAttempts.map(a => a.score)) : 0;
                      const isCompleted = attemptCount > 0;
                      ${p1}<h3 className="font-serif italic text-2xl text-[#121212]">`;
});

// Replace "Completed - Score: {user.history.find(h => h.caseId === c.id)?.score}/100"
// with "Personal Best: {bestScore}/100 | Attempts: {attemptCount}"
content = content.replace(
  /Completed - Score: \{user\.history\.find\(h => h\.caseId === c\.id\)\?\.score\}\/100/g,
  "Personal Best: {bestScore}/100 | Attempts: {attemptCount}"
);

// We should also add "Export Case" button next to "External Reference" or in the right column
const exportBtn = `
                          <button
                            onClick={() => handleExport(c)}
                            className="w-full md:w-auto px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] flex items-center justify-center space-x-1.5 transition-all border border-[#121212]/30 text-[#121212]/70 hover:bg-[#121212]/5 hover:text-[#121212] bg-white"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Export Case JSON</span>
                          </button>
                        </div>
                      </div>
                    );`;

content = content.replace(
  /<\/div>\s*<\/div>\s*\);\s*}\)\}/,
  exportBtn.replace("</div>", "") + "})}"
); // Actually it's easier to just use sed or regex carefully. Let's do it via regex.

fs.writeFileSync('src/components/CaseLibrary.tsx', content);
