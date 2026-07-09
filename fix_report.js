import fs from 'fs';
let content = fs.readFileSync('src/components/ResultReport.tsx', 'utf8');

const target = `<button
        onClick={onContinue}
        className="w-full py-4 bg-[#121212] hover:bg-[#121212]/90 text-white text-sm font-bold uppercase tracking-[0.2em] shadow-none border-t border-[#121212] transition-colors flex items-center justify-center space-x-2 cursor-pointer"
        id="return-library-btn"
      >
        <span>FILE ARCHIVE & RETURN TO LIBRARY</span>
        <ChevronRight className="h-4 w-4" />
      </button>`;

const replacement = `<div className="flex gap-4">
      <button
        onClick={() => window.print()}
        className="w-1/3 py-4 bg-white hover:bg-[#121212]/5 text-[#121212] border border-[#121212] text-sm font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center space-x-2 cursor-pointer"
      >
        <span>Print Report</span>
      </button>
      <button
        onClick={onContinue}
        className="w-2/3 py-4 bg-[#121212] hover:bg-[#121212]/90 text-white text-sm font-bold uppercase tracking-[0.2em] shadow-none border border-[#121212] transition-colors flex items-center justify-center space-x-2 cursor-pointer"
        id="return-library-btn"
      >
        <span>FILE ARCHIVE & RETURN TO LIBRARY</span>
        <ChevronRight className="h-4 w-4" />
      </button>
      </div>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/ResultReport.tsx', content);
