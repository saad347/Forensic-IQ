import { CompletedCaseSession, Case } from '../types';
import { Award, BookOpen, CheckCircle, XCircle, ChevronRight, HelpCircle, AlertTriangle, FileText, ExternalLink } from 'lucide-react';

interface ResultReportProps {
  session: CompletedCaseSession;
  currentCase: Case;
  onContinue: () => void;
}

export default function ResultReport({ session, currentCase, onContinue }: ResultReportProps) {
  const isCorrect = session.correct;
  const score = session.score;

  // Grade classification letter
  const getGradeLetter = (val: number) => {
    if (val >= 90) return 'A';
    if (val >= 80) return 'B';
    if (val >= 70) return 'C';
    if (val >= 50) return 'D';
    return 'F';
  };

  const gradeLetter = getGradeLetter(score);

  return (
    <div className="border-2 border-[#121212] bg-[#FFFFFF] p-6 shadow-none space-y-6" id="result-scorecard">
      
      {/* Grade and Title block */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-[#121212] gap-4">
        <div className="flex items-center space-x-3">
          {isCorrect ? (
            <CheckCircle className="h-10 w-10 text-emerald-600 stroke-[1.5]" />
          ) : (
            <XCircle className="h-10 w-10 text-red-600 stroke-[1.5]" />
          )}
          <div>
            <h3 className="font-serif italic text-2xl text-[#121212]">
              {isCorrect ? 'Case Solved Successfully' : 'Investigation Concluded (Unsolved)'}
            </h3>
            <p className="text-[10px] font-mono text-[#121212]/50 uppercase tracking-widest mt-1">
              SUBMITTED: {new Date(session.completedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Huge Grade Badge */}
        <div className="flex items-center space-x-4 bg-[#F1EFE9] border border-[#121212] p-4 shadow-none">
          <div className="text-center">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#121212]/50 block">Grade</span>
            <span className={`text-3xl font-serif italic font-extrabold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
              {gradeLetter}
            </span>
          </div>
          <div className="h-8 w-px bg-[#121212]/20" />
          <div className="text-center">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#121212]/50 block">Score</span>
            <span className="text-2xl font-mono font-bold text-[#121212]">
              {score}<span className="text-[#121212]/50 text-xs">/100</span>
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Metrics Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="scorecard-breakdown">
        {/* Correctness */}
        <div className="bg-[#FFFFFF] border border-[#121212]/30 p-4 text-center space-y-1">
          <span className="text-[9px] font-mono font-bold text-[#121212]/50 uppercase tracking-widest block">Diagnosis Accuracy</span>
          <span className={`text-lg font-serif italic font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
            {isCorrect ? '100 / 100' : '0 / 100'}
          </span>
          <span className="text-[10px] text-[#121212]/60 block leading-normal">Selected taxonomy match</span>
        </div>

        {/* Evidence Efficiency */}
        <div className="bg-[#FFFFFF] border border-[#121212]/30 p-4 text-center space-y-1">
          <span className="text-[9px] font-mono font-bold text-[#121212]/50 uppercase tracking-widest block">Research Efficiency</span>
          <span className="text-lg font-serif italic font-bold text-[#121212]">
            {Math.max(0, 100 - session.pointsSpent)}%
          </span>
          <span className="text-[10px] text-[#121212]/60 block leading-normal">Remaining budget of {currentCase.startingBudget}</span>
        </div>

        {/* Written Justification Quality */}
        <div className="bg-[#FFFFFF] border border-[#121212]/30 p-4 text-center space-y-1">
          <span className="text-[9px] font-mono font-bold text-[#121212]/50 uppercase tracking-widest block">Justification Rigor</span>
          <span className="text-lg font-serif italic font-bold text-red-700">
            {session.gradingScore ?? (isCorrect ? '80' : '30')}%
          </span>
          <span className="text-[10px] text-[#121212]/60 block leading-normal">Written report evaluation score</span>
        </div>
      </div>

      {/* Socratic / Metallurgical feedback */}
      {session.gradingFeedback && (
        <div className="bg-red-50/40 border border-red-300 p-4 space-y-2" id="ai-evaluation-feedback">
          <div className="flex items-center space-x-1.5 text-[9px] font-bold text-red-800 uppercase tracking-widest font-mono">
            <Award className="h-4 w-4 text-red-600" />
            <span>Metallurgical Evaluation Desk Report</span>
          </div>
          <p className="text-xs text-red-950 leading-relaxed font-sans font-medium">
            {session.gradingFeedback}
          </p>
        </div>
      )}

      {/* True scientific causal chain description */}
      <div className="space-y-3.5" id="causal-chain-panel">
        <h4 className="font-serif italic text-lg text-[#121212] flex items-center space-x-2 border-b border-[#121212]/20 pb-2">
          <BookOpen className="h-4 w-4 text-red-600" />
          <span>True Forensic Causal Chain (The Physical Physics)</span>
        </h4>
        <div className="bg-[#F1EFE9] p-5 border border-[#121212]/15 space-y-3.5 text-xs text-[#121212]/95 leading-relaxed font-serif">
          <p className="font-serif italic text-sm">
            {currentCase.causalChain}
          </p>
          <div className="bg-white p-3 border border-[#121212]/10 flex flex-col items-start gap-2 font-sans not-italic text-[#121212]/80">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-[#121212]/50 shrink-0 mt-0.5" />
              <span className="text-[11px] leading-normal">
                <strong>Source Engineering Citation:</strong> {currentCase.citation}
              </span>
            </div>
            {currentCase.officialResourceUrl && (
              <a 
                href={currentCase.officialResourceUrl} 
                target="_blank" 
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-red-700 hover:text-red-800 font-bold tracking-wider hover:underline ml-6"
              >
                <span>READ FULL {currentCase.resourceTitle ? `"${currentCase.resourceTitle}"` : "ARTICLE"}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Action / Next steps button */}
      <div className="pt-4 border-t border-[#121212] flex justify-end">
        <button
          onClick={onContinue}
          className="px-6 py-3 bg-[#121212] hover:bg-[#121212]/90 text-white text-xs font-bold uppercase tracking-[0.25em] border border-[#121212] flex items-center space-x-1.5 transition-all cursor-pointer"
          id="continue-button"
        >
          <span>Return to Cases Console</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
