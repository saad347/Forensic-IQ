import fs from 'fs';
let content = fs.readFileSync('src/components/CaseLibrary.tsx', 'utf8');

const target = `                            </a>
                          )}`;

const replacement = `                            </a>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleExport(c); }}
                            className="w-full md:w-auto px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] flex items-center justify-center space-x-1.5 transition-all border border-[#121212]/30 text-[#121212]/70 hover:bg-[#121212]/5 hover:text-[#121212] bg-white"
                          >
                            <span>Export Case</span>
                          </button>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/CaseLibrary.tsx', content);
