import React, { useState } from 'react';
import { Case, UserProfile } from '../types';
import { Play, Award, CheckCircle2, Shield, Flame, Compass, ChevronRight, BarChart3, HelpCircle, Search, SlidersHorizontal } from 'lucide-react';

interface CaseLibraryProps {
  cases: Case[];
  user: UserProfile;
  onSelectCase: (c: Case) => void;
}

export default function CaseLibrary({ cases, user, onSelectCase }: CaseLibraryProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [visibleCount, setVisibleCount] = useState(6);
  
  // Calculate running stats
  const completedIds = user.history.map(h => h.caseId);
  const totalSolved = user.history.filter(h => h.correct).length;
  const avgScore = user.history.length > 0 
    ? Math.round(user.history.reduce((acc, h) => acc + h.score, 0) / user.history.length)
    : 0;

  // Filter cases dynamically based on type, search and difficulty
  const filteredCases = cases.filter(c => {
    if (selectedType && c.majorCaseType !== selectedType) return false;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.system.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || c.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const displayedCases = filteredCases.slice(0, visibleCount);

  // Group by Case Type for the initial selection view
  const caseTypeCounts = cases.reduce((acc, c) => {
    acc[c.majorCaseType] = (acc[c.majorCaseType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const caseCategories = Object.entries(caseTypeCounts).sort((a, b) => a[0].localeCompare(b[0]));

  // Difficulty badge styling helper
  const getDifficultyStyle = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Intermediate': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Advanced': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  // Dial value formatting helper (1-5 range to sharp blocks)
  const renderDial = (val: number, colorClass: string) => {
    return (
      <div className="flex space-x-1 mt-1.5" title={`${val} / 5`}>
        {[1, 2, 3, 4, 5].map((idx) => (
          <div
            key={idx}
            className={`h-2 w-4 border border-[#121212] transition-colors ${
              idx <= val 
                ? (colorClass.includes('indigo') ? 'bg-[#121212]' : 'bg-red-600') 
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in" id="case-library-view">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Case List Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {!selectedType ? (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b-2 border-[#121212] pb-6">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseCategories.map(([type, count]) => (
                  <button 
                    key={type}
                    onClick={() => {
                      setSelectedType(type);
                      setVisibleCount(6);
                      setDifficultyFilter('All');
                      setSearchQuery('');
                    }}
                    className="text-left border border-[#121212] bg-[#FFFFFF] hover:bg-[#121212] hover:text-white group p-6 transition-all flex flex-col justify-center min-h-[140px]"
                  >
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 group-hover:text-red-400 block mb-3">
                      {count} RECORDED CASES
                    </span>
                    <h3 className="font-serif italic text-2xl text-[#121212] group-hover:text-white leading-tight">
                      {type}
                    </h3>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div>
                <button 
                  onClick={() => { setSelectedType(null); setSearchQuery(''); setDifficultyFilter('All'); }}
                  className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#121212]/60 hover:text-[#121212] flex items-center gap-1 mb-6 transition-colors"
                >
                  <ChevronRight className="h-3.5 w-3.5 rotate-180" /> BACK TO CATEGORIES
                </button>
                <div className="border-b-2 border-[#121212] pb-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 block mb-1">
                    Category Filter Applied
                  </span>
                  <h2 className="font-serif italic text-4xl lg:text-5xl text-[#121212] leading-tight">
                    {selectedType}
                  </h2>
                </div>
              </div>

              {/* Search and Filters Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-[#121212] bg-[#FFFFFF]" id="catalog-filters">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-[#121212]/40" />
              <input
                type="text"
                placeholder="Search incident titles, systems, components, descriptions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(6); // reset pagination on search
                }}
                className="w-full pl-9 pr-4 py-2.5 text-xs border border-[#121212] bg-[#FFFFFF] text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212] placeholder-[#121212]/40 font-mono"
                id="case-search-input"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-3.5 h-3.5 w-3.5 text-[#121212]/40" />
              <select
                value={difficultyFilter}
                onChange={(e) => {
                  setDifficultyFilter(e.target.value as any);
                  setVisibleCount(6); // reset pagination on filter
                }}
                className="w-full pl-9 pr-4 py-2.5 text-xs border border-[#121212] bg-[#FFFFFF] text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212] font-mono font-bold font-mono"
                id="difficulty-filter-select"
              >
                <option value="All">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="space-y-8" id="case-cards-container">
            {displayedCases.length === 0 ? (
              <div className="border border-[#121212] border-dashed p-10 text-center bg-[#FFFFFF]" id="no-cases-found">
                <span className="text-xs font-mono font-bold text-[#121212]/60 uppercase tracking-wider block mb-2">No Matching Incident Files</span>
                <p className="text-sm text-[#121212]/80 max-w-md mx-auto leading-relaxed">
                  Adjust your search keyword or selected difficulty filter to retrieve registry archives.
                </p>
              </div>
            ) : (
              Object.entries(
                displayedCases.reduce((acc, c) => {
                  if (!acc[c.difficulty]) acc[c.difficulty] = [];
                  acc[c.difficulty].push(c);
                  return acc;
                }, {} as Record<string, Case[]>)
              )
              .sort(([a], [b]) => {
                const order: Record<string, number> = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
                return (order[a] || 4) - (order[b] || 4);
              })
              .map(([difficultyLevel, group]) => (
                <div key={difficultyLevel} className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#121212]/30 pb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 border border-red-100">
                      DIFFICULTY LEVEL
                    </span>
                    <h4 className="text-xl font-serif italic text-[#121212]">{difficultyLevel}</h4>
                  </div>
                  {group.map((c) => {
                    const isCompleted = completedIds.includes(c.id);
                    const historyEntry = user.history.find(h => h.caseId === c.id);
                    const wasCorrect = historyEntry?.correct;

                    return (
                      <div
                        key={c.id}
                        className={`border border-[#121212] p-6 bg-[#FFFFFF] transition-all duration-200 relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
                          isCompleted ? 'bg-[#F1EFE9]/40 border-dashed' : 'hover:bg-[#F1EFE9]/20'
                        }`}
                        id={`case-card-${c.id}`}
                      >
                        {/* Left Content */}
                        <div className="space-y-3.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className={`px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase border ${getDifficultyStyle(c.difficulty)}`}>
                              {c.difficulty}
                            </span>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#121212]/50">
                              {c.system}
                            </span>
                            {isCompleted && (
                              <span className={`flex items-center text-[10px] font-mono font-bold uppercase tracking-wider ${wasCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                                {wasCorrect ? (
                                  <>
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" /> SOLVED [Score: {historyEntry?.score}]
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-red-600" /> UNSOLVED
                                  </>
                                )}
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif italic text-xl text-[#121212] leading-none">
                            {c.title}
                          </h3>
                          <p className="text-xs text-[#121212]/80 leading-relaxed max-w-xl">
                            {c.shortDescription}
                          </p>

                          {/* Ambiguity & Red-Herring Dial Metrics */}
                          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-3 border-t border-[#121212]/10 text-[9px] font-mono font-bold text-[#121212]/60 uppercase tracking-widest">
                            <div>
                              <span>Ambiguity Rating</span>
                              {renderDial(c.ambiguity, 'bg-indigo-500')}
                            </div>
                            <div>
                              <span>Red-Herring Density</span>
                              {renderDial(c.redHerringDensity, 'bg-amber-500')}
                            </div>
                          </div>
                        </div>

                        {/* Play / Select Button Right */}
                        <div className="shrink-0 w-full md:w-auto flex justify-end">
                          <button
                            onClick={() => onSelectCase(c)}
                            className={`w-full md:w-auto px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-1.5 transition-all border border-[#121212] cursor-pointer ${
                              isCompleted 
                                ? 'bg-[#F1EFE9] hover:bg-[#121212] hover:text-white text-[#121212]' 
                                : 'bg-[#121212] hover:bg-[#121212]/90 text-white shadow-sm'
                            }`}
                            id={`select-case-${c.id}`}
                          >
                            <Play className="h-3 w-3 fill-current" />
                            <span>{isCompleted ? 'Review Records' : 'Launch File'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

              {filteredCases.length > visibleCount && (
                <div className="flex justify-center pt-2" id="load-more-container">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="px-6 py-3 bg-[#FFFFFF] hover:bg-[#121212] hover:text-[#F9F7F2] text-[#121212] border border-[#121212] text-xs font-bold uppercase tracking-[0.25em] transition-all cursor-pointer flex items-center gap-1.5"
                    id="load-more-cases-btn"
                  >
                    <span>LOAD MORE CASES</span>
                    <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar stats/guidance Right Column */}
        <div className="space-y-8">
          
          {/* Stats Dashboard */}
          <div className="border border-[#121212] bg-[#121212] p-6 text-white space-y-6" id="stats-dashboard">
            <div className="border-b border-[#F9F7F2]/20 pb-4">
              <span className="text-[9px] font-mono font-bold tracking-[0.3em] uppercase text-red-500 block mb-1">
                UET Registry Desk
              </span>
              <h3 className="font-serif italic text-2xl text-[#F9F7F2] flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-red-500" />
                <span>Investigator Console</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#121212] border border-[#F9F7F2]/20 p-4">
                <span className="text-[9px] font-mono text-[#F9F7F2]/50 block uppercase tracking-wider">Solved Ratio</span>
                <span className="text-2xl font-serif italic text-white mt-1 block">
                  {totalSolved} <span className="text-xs font-sans not-italic text-[#F9F7F2]/40">/ {cases.length}</span>
                </span>
              </div>
              <div className="bg-[#121212] border border-[#F9F7F2]/20 p-4">
                <span className="text-[9px] font-mono text-[#F9F7F2]/50 block uppercase tracking-wider">Average Score</span>
                <span className="text-2xl font-serif italic text-white mt-1 block">
                  {avgScore}<span className="text-xs font-sans not-italic text-[#F9F7F2]/40">/100</span>
                </span>
              </div>
            </div>

            {/* Micro certification competency tracks */}
            <div className="pt-4 border-t border-[#F9F7F2]/20 space-y-3 text-xs">
              <span className="text-[9px] font-mono font-bold text-[#F9F7F2]/50 uppercase tracking-widest block">
                METALLURGICAL COMPETENCY
              </span>
              <div className="space-y-2 text-slate-300 font-mono text-[11px]">
                <div className="flex justify-between items-center bg-[#1F1F1F] p-3 border border-transparent">
                  <span className="text-slate-300">ASNT Level II NDT</span>
                  <span className="text-[9px] bg-red-600/20 text-red-400 border border-red-600/30 font-bold px-2 py-0.5">ALIGNED</span>
                </div>
                <div className="flex justify-between items-center bg-[#1F1F1F] p-3 border border-transparent">
                  <span className="text-slate-300">ISO 9712 Failure</span>
                  <span className="text-[9px] bg-red-600/20 text-red-400 border border-red-600/30 font-bold px-2 py-0.5">ALIGNED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pedagogical info card */}
          <div className="border border-[#121212] bg-[#F1EFE9] p-6 space-y-4" id="pedagogy-card">
            <div className="border-b border-[#121212]/10 pb-3">
              <h3 className="font-serif italic text-xl text-[#121212] flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-red-600" />
                <span>Forensic Protocol Playbook</span>
              </h3>
            </div>
            <div className="text-xs text-[#121212]/80 space-y-4 leading-relaxed">
              <div className="flex gap-3">
                <div className="bg-[#121212] text-[#F9F7F2] h-5 w-5 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                  01
                </div>
                <p>Read the <strong>Briefing Sheet</strong> thoroughly to understand operational parameters and background conditions.</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-[#121212] text-[#F9F7F2] h-5 w-5 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                  02
                </div>
                <p>Formulate an initial <strong>Working Hypothesis</strong> first. System rules require at least one entry before file unlocks are permitted.</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-[#121212] text-[#F9F7F2] h-5 w-5 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                  03
                </div>
                <p>Unlock visual fractographs, real-time sensor logs, and certifications carefully, conserving the 100 pt investigation budget.</p>
              </div>
              <div className="flex gap-3">
                <div className="bg-[#121212] text-[#F9F7F2] h-5 w-5 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                  04
                </div>
                <p>Retrieve <strong>expert instructor hints</strong> at any time to guide your thinking if you get stuck on a difficult diagnosis.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
