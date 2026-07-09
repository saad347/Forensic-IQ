import { useState, useEffect } from 'react';
import { INITIAL_CASES } from './data/cases';
import { Case, UserProfile, Hypothesis, CompletedCaseSession, EvidenceCard } from './types';
import Navbar from './components/Navbar';
import CaseLibrary from './components/CaseLibrary';
import EvidenceGrid from './components/EvidenceGrid';
import HypothesisPanel from './components/HypothesisPanel';
import SubmitDiagnosis from './components/SubmitDiagnosis';
import ResultReport from './components/ResultReport';
import InstructorPanel from './components/InstructorPanel';
import { Shield, BookOpen, UserCheck, AlertCircle, HelpCircle, ChevronLeft } from 'lucide-react';

export default function App() {
  // Simulator state
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('forensiq_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      name: 'Ayesha Bashir',
      role: 'student',
      institution: 'UET Lahore',
      history: [],
      totalScore: 0
    };
  });

  const [cases, setCases] = useState<Case[]>(() => {
    const saved = localStorage.getItem('forensiq-cases');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return [...INITIAL_CASES, ...parsed];
      } catch (e) {}
    }
    return INITIAL_CASES;
  });
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  
  // Game state for the currently active case
  const [budget, setBudget] = useState(100);
  const [pointsSpent, setPointsSpent] = useState(0);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [evidence, setEvidence] = useState<EvidenceCard[]>([]);
  const [completedSession, setCompletedSession] = useState<CompletedCaseSession | null>(null);

  // Guidebook Hint state
  const [guidebookHint, setGuidebookHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [submittingDiagnosis, setSubmittingDiagnosis] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync profile changes to localStorage
  useEffect(() => {
    localStorage.setItem('forensiq_profile', JSON.stringify(user));
  }, [user]);

  // Initialize a new case
  const handleLaunchCase = (c: Case) => {
    // Check if they previously completed this case to load session or start fresh
    const historyEntry = user.history.find(h => h.caseId === c.id);
    
    // Reset temporary case parameters
    setBudget(c.startingBudget);
    setPointsSpent(0);
    setHypotheses([]);
    setGuidebookHint(null);
    setErrorMessage(null);

    // Prepare deep copy of case evidence cards, reset unlocked states
    const freshEvidence = c.evidence.map(e => ({
      ...e,
      unlocked: false
    }));
    setEvidence(freshEvidence);
    setActiveCase(c);

    if (historyEntry) {
      setCompletedSession(historyEntry);
      // Mark all evidence as unlocked for review
      setEvidence(freshEvidence.map(e => ({ ...e, unlocked: true })));
    } else {
      setCompletedSession(null);
    }
  };

  // Add a new hypothesis in the log
  const handleAddHypothesis = (text: string) => {
    const newHyp: Hypothesis = {
      id: `hyp_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      unlockedEvidenceCount: evidence.filter(e => e.unlocked).length
    };
    setHypotheses([...hypotheses, newHyp]);
    setErrorMessage(null); // Clear any block error
  };

  // Unlock an evidence card costing budget points
  const handleUnlockEvidence = (cardId: string, cost: number) => {
    // Protocol Enforcement: must have logged at least 1 hypothesis
    if (hypotheses.length === 0) {
      setErrorMessage("Forensic Protocol Blocked: You must record at least one working hypothesis in the Log before spending points to unlock further evidence. This promotes structured reasoning rather than guess-clicking.");
      return;
    }

    if (budget < cost) {
      setErrorMessage("Inspection Budget Exhausted: You do not have enough remaining budget points to unlock this evidence card. Consider formulating your final report using what you currently have.");
      return;
    }

    // Spend points, flag card as unlocked
    setBudget(prev => prev - cost);
    setPointsSpent(prev => prev + cost);
    setEvidence(prev => prev.map(card => {
      if (card.id === cardId) {
        return { ...card, unlocked: true };
      }
      return card;
    }));
    setErrorMessage(null); // Clear error
  };

  // Retrieve expert instructor hints locally (Instant, offline)
  const handleConsultGuidebook = () => {
    if (!activeCase) return;
    setLoadingHint(true);
    setGuidebookHint(null);

    setTimeout(() => {
      const hintCount = activeCase.hintPool.length;
      if (hintCount > 0) {
        // Select hint sequentially based on current logged hypotheses count or random
        const index = hypotheses.length % hintCount;
        setGuidebookHint(activeCase.hintPool[index]);
      } else {
        setGuidebookHint("Review the fracture surface characteristics and mechanical stress calculations.");
      }
      setLoadingHint(false);
    }, 450);
  };

  // Submit diagnosis for scoring via high-fidelity local grading engine
  const handleSubmitDiagnosis = (suspectedCauseId: string, justification: string, citedEvidenceIds: string[]) => {
    if (!activeCase) return;
    setSubmittingDiagnosis(true);
    setErrorMessage(null);

    const isCorrect = suspectedCauseId === activeCase.correctCauseId;
    const correctCause = activeCase.taxonomyCauses.find(c => c.id === activeCase.correctCauseId);
    const userCause = activeCase.taxonomyCauses.find(c => c.id === suspectedCauseId);

    const correctPoints = isCorrect ? 50 : 0;
    const unlockedRedHerringsCount = evidence.filter(e => e.unlocked && e.redHerring).length;
    const redHerringPenalty = unlockedRedHerringsCount * 10;
    const budgetBonus = Math.round(budget * 0.5);
    const baseInvestigativeScore = Math.max(0, correctPoints + budgetBonus - redHerringPenalty);

    let justificationScore = 0;
    let correctCitations = 0;
    let correctCitationPoints = 0;
    let redHerringPenaltyPoints = 0;
    let citedRedHerrings: string[] = [];
    let citedValidEvidence: string[] = [];

    citedEvidenceIds.forEach(id => {
      const card = evidence.find(e => e.id === id);
      if (card) {
        if (card.supportsCauseIds.includes(activeCase.correctCauseId)) {
          correctCitations++;
          if (correctCitations === 1) correctCitationPoints += 40;
          else correctCitationPoints += 10;
          citedValidEvidence.push(card.name);
        }
        if (card.redHerring) {
          redHerringPenaltyPoints += 15;
          citedRedHerrings.push(card.name);
        }
      }
    });

    correctCitationPoints = Math.min(70, correctCitationPoints);
    justificationScore = correctCitationPoints - redHerringPenaltyPoints;
    justificationScore = Math.max(0, Math.min(100, justificationScore));

    if (citedEvidenceIds.length === 0) {
      justificationScore = 0;
    }

    const finalScore = Math.round((baseInvestigativeScore * 0.6) + (justificationScore * 0.4));

    const getClientFeedback = () => {
      const uCauseName = userCause?.name || 'Unknown Mechanism';
      const cCauseName = correctCause?.name || 'Unknown Mechanism';

      let text = isCorrect 
        ? `Excellent physical diagnosis! Your identification of ${cCauseName} perfectly aligns with the forensic metallurgical observations. ` 
        : `Peer Review Status: Rejected. You proposed ${uCauseName}, but structural archives do not substantiate this. `;

      if (citedEvidenceIds.length === 0) {
        text += "No evidence was cited to support this diagnosis. ";
      } else {
        if (citedValidEvidence.length > 0) {
          text += `Your citation of ${citedValidEvidence.join(', ')} correctly supports the physics of this failure. `;
        } else if (isCorrect) {
          text += `However, your cited evidence does not strongly support this conclusion. `;
        }
        
        if (citedRedHerrings.length > 0) {
          text += `Note: Your citation of ${citedRedHerrings.join(', ')} weakens your report; this evidence was a red herring intended to test your diagnostic focus. `;
        }
      }
      return text;
    };

    setTimeout(() => {
      const newSession = {
        caseId: activeCase.id,
        completedAt: new Date().toISOString(),
        score: finalScore,
        suspectedCauseId,
        justification,
        hypotheses,
        unlockedEvidenceIds: evidence.filter(e => e.unlocked).map(e => e.id),
        pointsSpent,
        correct: isCorrect,
        gradingFeedback: getClientFeedback(),
        gradingScore: justificationScore
      };

      const updatedHistory = [...user.history, newSession];
      const newTotalScore = updatedHistory.reduce((acc, h) => acc + h.score, 0);

      setUser(prev => ({
        ...prev,
        history: updatedHistory,
        totalScore: newTotalScore
      }));

      setCompletedSession(newSession);
      setSubmittingDiagnosis(false);
    }, 1100);
  };



  // Reset simulator state
  const handleResetProgress = () => {
    if (confirm("Are you sure you want to erase all your investigation history, scores, and portfolio data? This action cannot be undone.")) {
      const freshProfile: UserProfile = {
        name: 'Ayesha Bashir',
        role: 'student',
        institution: 'UET Lahore',
        history: [],
        totalScore: 0
      };
      setUser(freshProfile);
      setActiveCase(null);
      setCompletedSession(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex flex-col font-sans text-[#121212] antialiased" id="forensiq-app-root">
      
      {/* Top Navbar */}
      <Navbar
        user={user}
        onChangeRole={(role) => setUser(prev => ({ ...prev, role }))}
        onResetProgress={handleResetProgress}
      />

      <main className="flex-1">
        {user.role === 'instructor' ? (
          /* Instructor Mode Screen */
          <InstructorPanel />
        ) : !activeCase ? (
          /* Case Selection Screen */
          <CaseLibrary
            cases={cases}
            setCases={setCases}
            user={user}
            onSelectCase={handleLaunchCase}
          />
        ) : (
          /* Active Case Investigation Sandbox */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" id="investigation-sandbox">
            
            {/* Case Header / Top Navigation bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#121212]">
              <button
                onClick={() => {
                  setActiveCase(null);
                  setCompletedSession(null);
                }}
                className="flex items-center text-xs font-bold text-[#121212] hover:bg-[#F1EFE9] font-mono tracking-wider uppercase py-2 px-4 bg-white border border-[#121212] rounded-none transition-all cursor-pointer"
                id="back-to-library-btn"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span>Return to Cases</span>
              </button>
              <div className="text-right">
                <span className="text-[9px] font-mono font-bold text-[#121212]/50 uppercase tracking-widest block">CASE STUDY STUDY</span>
                <h2 className="text-lg font-serif italic text-[#121212] leading-tight">{activeCase.title}</h2>
              </div>
            </div>

            {/* If completed, show results scorecard overlay */}
            {completedSession && (
              <ResultReport
                session={completedSession}
                currentCase={activeCase}
                onContinue={() => {
                  setActiveCase(null);
                  setCompletedSession(null);
                }}
              />
            )}

            {/* Main Active Investigation Sandbox Row */}
            {!completedSession && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Column: Briefing & Socratic Tutor & Submit */}
                <div className="space-y-6 lg:sticky lg:top-20">
                  
                  {/* Case Briefing Card */}
                  <div className="border border-[#121212] bg-[#FFFFFF] p-5 shadow-none rounded-none space-y-3" id="case-briefing-card">
                    <h3 className="font-serif italic text-base text-[#121212] flex items-center space-x-1.5 border-b border-[#121212]/20 pb-2">
                      <BookOpen className="h-4 w-4 text-red-600" />
                      <span>Incident Briefing</span>
                    </h3>
                    <div 
                      className="text-xs text-[#121212]/85 leading-relaxed font-sans"
                      dangerouslySetInnerHTML={{ __html: activeCase.briefing }}
                    />
                  </div>

                  {/* Socratic Hint Board Block */}
                  <div className="border border-[#121212] bg-[#FFFFFF] p-5 text-[#121212] shadow-none rounded-none space-y-4" id="case-guidebook-card">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif italic text-sm text-[#121212] flex items-center gap-1.5">
                        <HelpCircle className="h-4 w-4 text-red-600" />
                        <span>Case Guidebook</span>
                      </h4>
                      <span className="text-[9px] font-mono bg-[#121212] text-white px-2 py-0.5 tracking-wider font-bold uppercase">
                        GUIDEBOOK
                      </span>
                    </div>
                    <p className="text-[11px] text-[#121212]/75 leading-relaxed">
                      Need material or fractography guidance? Consult the case guidebook for professional direction.
                    </p>

                    <button
                      onClick={handleConsultGuidebook}
                      disabled={loadingHint}
                      className="w-full py-3 bg-[#121212] hover:bg-[#121212]/90 border border-[#121212] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-none transition-all flex items-center justify-center space-x-1.5 cursor-pointer font-mono"
                      id="ask-guidebook-btn"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-red-600" />
                      <span>{loadingHint ? 'CONSULTING REPOSITORIES...' : 'RETRIEVE GUIDEBOOK HINT'}</span>
                    </button>

                    {guidebookHint && (
                      <div className="bg-[#F1EFE9] p-4 border border-[#121212]/15 text-[11px] text-[#121212] italic font-serif leading-relaxed animate-fade-in" id="guidebook-hint-bubble">
                        "{guidebookHint}"
                      </div>
                    )}
                  </div>

                  {/* Submission Form */}
                  <SubmitDiagnosis
                    currentCase={activeCase}
                    unlockedEvidence={evidence.filter(e => e.unlocked)}
                    onSubmit={handleSubmitDiagnosis}
                    submitting={submittingDiagnosis}
                  />

                </div>

                {/* Right Columns: Evidence Grid & Hypothesis Panel */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Floating Action/Alert message banner */}
                  {errorMessage && (
                    <div className="bg-red-50/50 border-2 border-red-600 p-4 flex items-start space-x-2.5 animate-bounce-short text-xs text-red-950 rounded-none font-serif italic" id="protocol-alert">
                      <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="font-serif leading-relaxed">
                        {errorMessage}
                      </div>
                    </div>
                  )}

                  {/* Investigation Budget and Score Bar */}
                  <div className="border border-[#121212] bg-[#FFFFFF] p-4 shadow-none rounded-none flex flex-col sm:flex-row items-center justify-between gap-4" id="budget-bar">
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <div className="p-2 border border-[#121212] text-red-600 bg-[#F1EFE9]">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#121212]/50 block">Investigation Budget</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-mono font-bold text-[#121212]">{budget} pts</span>
                          <span className="text-[10px] text-[#121212]/50 font-mono">/ {activeCase.startingBudget} limit</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar representation */}
                    <div className="flex-1 w-full max-w-md hidden md:block">
                      <div className="w-full bg-[#F1EFE9] border border-[#121212] h-4 overflow-hidden rounded-none">
                        <div 
                          className="bg-red-600 h-full transition-all duration-300"
                          style={{ width: `${(budget / activeCase.startingBudget) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-center sm:text-right w-full sm:w-auto">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#121212]/50 block">Current Status</span>
                      <span className="text-[10px] font-mono font-bold text-[#121212] bg-[#F1EFE9] border border-[#121212]/20 px-2.5 py-0.5 uppercase tracking-wider rounded-none inline-block">
                        {evidence.filter(e => e.unlocked).length === 0 ? 'NOT STARTED' : 'ACTIVE INQUIRY'}
                      </span>
                    </div>
                  </div>

                  {/* Hypothesis Log */}
                  <HypothesisPanel
                    hypotheses={hypotheses}
                    unlockedCount={evidence.filter(e => e.unlocked).length}
                    onAddHypothesis={handleAddHypothesis}
                  />

                  {/* Evidence Board Grid */}
                  <EvidenceGrid
                    evidence={evidence}
                    caseId={activeCase.id}
                    hasHypotheses={hypotheses.length > 0}
                    budget={budget}
                    onUnlock={handleUnlockEvidence}
                  />

                </div>

              </div>
            )}

          </div>
        )}
      </main>

      {/* Humble Footer */}
      <footer className="bg-[#121212] text-[#F9F7F2] py-8 border-t border-[#121212] mt-auto text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-serif italic text-sm">© 2026 ForensiQ Corporation. confidential — internal educational use only.</p>
          <p className="text-[10px] text-[#F9F7F2]/60 mt-1.5 font-mono uppercase tracking-widest">
            UET Metallurgical Failure Case Catalog (v1.0-MVP-Release)
          </p>
        </div>
      </footer>

    </div>
  );
}
