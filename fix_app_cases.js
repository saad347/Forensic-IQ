import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "  const [activeCase, setActiveCase] = useState<Case | null>(null);",
  "  const [cases, setCases] = useState<Case[]>(() => {\n    const saved = localStorage.getItem('forensiq-cases');\n    if (saved) {\n      try {\n        const parsed = JSON.parse(saved);\n        if (Array.isArray(parsed) && parsed.length > 0) return [...INITIAL_CASES, ...parsed];\n      } catch (e) {}\n    }\n    return INITIAL_CASES;\n  });\n  const [activeCase, setActiveCase] = useState<Case | null>(null);"
);

content = content.replace(
  "          <CaseLibrary\n            cases={INITIAL_CASES}",
  "          <CaseLibrary\n            cases={cases}\n            setCases={setCases}"
);

fs.writeFileSync('src/App.tsx', content);
