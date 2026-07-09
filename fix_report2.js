import fs from 'fs';
let content = fs.readFileSync('src/components/ResultReport.tsx', 'utf8');

const regex = /\{\/\* Action \/ Next steps button \*\/\}([\s\S]*?)<\/button>\s*<\/div>/g;

content = content.replace(regex, (match) => {
  return `
      {/* Evidence Review Section */}
      <div className="space-y-3.5 print-show" id="evidence-review-panel">
        <h4 className="font-serif italic text-lg text-[#121212] flex items-center space-x-2 border-b border-[#121212]/20 pb-2">
          <BookOpen className="h-4 w-4 text-red-600" />
          <span>Evidence Review (What you found)</span>
        </h4>
        <div className="space-y-2">
          {session.unlockedEvidenceIds.map(id => {
            const card = currentCase.evidence.find(e => e.id === id);
            if (!card) return null;
            return (
              <div key={card.id} className="p-3 border border-[#121212]/15 bg-white flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {card.redHerring ? (
                    <span className="text-red-600 font-bold text-xs uppercase">✗ Red Herring</span>
                  ) : (
                    <span className="text-emerald-600 font-bold text-xs uppercase">✓ Relevant</span>
                  )}
                  <span className="font-bold text-xs">{card.name}</span>
                </div>
                {card.redHerring && card.redHerringExplanation && (
                  <p className="text-[11px] text-[#121212]/70 italic mt-1">{card.redHerringExplanation}</p>
                )}
              </div>
            );
          })}
          {session.unlockedEvidenceIds.length === 0 && (
            <div className="text-[11px] text-[#121212]/50 italic">No evidence was unlocked.</div>
          )}
        </div>
      </div>
      
      {/* Action / Next steps button */}
      <div className="pt-4 border-t border-[#121212] flex gap-4">
        <button
          onClick={() => window.print()}
          className="w-1/3 py-4 bg-white hover:bg-[#121212]/5 text-[#121212] border border-[#121212] text-sm font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Print Report</span>
        </button>
        <button
          onClick={onContinue}
          className="w-2/3 py-4 bg-[#121212] hover:bg-[#121212]/90 text-white text-sm font-bold uppercase tracking-[0.2em] shadow-none border border-[#121212] transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          id="continue-button"
        >
          <span>Return to Cases Console</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>`;
});

fs.writeFileSync('src/components/ResultReport.tsx', content);
