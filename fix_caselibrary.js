import fs from 'fs';
let content = fs.readFileSync('src/components/CaseLibrary.tsx', 'utf8');

// Add setCases to props
content = content.replace(
  "  onSelectCase: (c: Case) => void;\n}",
  "  onSelectCase: (c: Case) => void;\n  setCases: React.Dispatch<React.SetStateAction<Case[]>>;\n}"
);

content = content.replace(
  "export default function CaseLibrary({ cases, user, onSelectCase }: CaseLibraryProps) {",
  "export default function CaseLibrary({ cases, user, onSelectCase, setCases }: CaseLibraryProps) {"
);

// Add import/export functions
const importExportLogic = `
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        const newCases = Array.isArray(imported) ? imported : [imported];
        // Basic validation
        const isValid = newCases.every(c => c.id && c.title && c.evidence && Array.isArray(c.evidence));
        if (!isValid) {
          alert('Import Error: JSON is missing required fields (id, title, or evidence array).');
          return;
        }
        setCases(prev => {
          // get existing imported cases from localstorage, merge, and save
          const saved = localStorage.getItem('forensiq-cases');
          let currentCustom = [];
          if (saved) {
            try { currentCustom = JSON.parse(saved); } catch(err) {}
          }
          const mergedCustom = [...currentCustom, ...newCases];
          localStorage.setItem('forensiq-cases', JSON.stringify(mergedCustom));
          
          const ids = new Set(prev.map(p => p.id));
          const uniqueNew = newCases.filter(nc => !ids.has(nc.id));
          return [...prev, ...uniqueNew];
        });
        alert(\`Successfully imported \${newCases.length} case(s).\`);
      } catch (err) {
        alert('Import Error: Malformed JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExport = (caseData?: Case) => {
    const data = caseData ? [caseData] : cases;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = caseData ? \`case-\${caseData.id}.json\` : 'forensiq-cases.json';
    a.click();
    URL.revokeObjectURL(url);
  };
`;

content = content.replace(
  "  const [visibleCount, setVisibleCount] = useState(6);",
  "  const [visibleCount, setVisibleCount] = useState(6);\n" + importExportLogic
);

// Add Import/Export buttons to UI (under Case Categories)
const headerButtons = `
              <div className="border-b-2 border-[#121212] pb-6 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#121212]/60 block mb-1">
                    Case Categories
                  </span>
                  <h2 className="font-serif italic text-4xl lg:text-5xl text-[#121212] leading-tight">
                    Select Failure Mode
                  </h2>
                  <p className="text-sm text-[#121212]/80 mt-2 font-sans max-w-xl leading-relaxed">
                    Choose a structural, fluid, or thermodynamic failure category to explore related incident investigations.
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <label className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-center border border-[#121212]/30 text-[#121212]/70 hover:bg-[#121212]/5 hover:text-[#121212] bg-white cursor-pointer">
                    Import Case Pack
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                  <button onClick={() => handleExport()} className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] border border-[#121212]/30 text-[#121212]/70 hover:bg-[#121212]/5 hover:text-[#121212] bg-white">
                    Export All Cases
                  </button>
                </div>
              </div>
`;

content = content.replace(
  /<div className="border-b-2 border-\[#121212\] pb-6">[\s\S]*?<\/div>/,
  headerButtons
);

fs.writeFileSync('src/components/CaseLibrary.tsx', content);
