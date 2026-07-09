import React, { useState } from 'react';
import { Case, EvidenceCard } from '../types';
import { Send, CheckSquare, ListFilter, ClipboardCheck, AlertTriangle } from 'lucide-react';

interface SubmitDiagnosisProps {
  currentCase: Case;
  unlockedEvidence: EvidenceCard[];
  onSubmit: (suspectedCauseId: string, justification: string, citedEvidenceIds: string[]) => void;
  submitting: boolean;
}

export default function SubmitDiagnosis({ currentCase, unlockedEvidence, onSubmit, submitting }: SubmitDiagnosisProps) {
  const [selectedCauseId, setSelectedCauseId] = useState('');
  const [justification, setJustification] = useState('');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);

  const handleToggleEvidence = (id: string) => {
    if (selectedEvidenceIds.includes(id)) {
      setSelectedEvidenceIds(selectedEvidenceIds.filter(eId => eId !== id));
    } else {
      setSelectedEvidenceIds([...selectedEvidenceIds, id]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCauseId || !justification.trim()) return;
    onSubmit(selectedCauseId, justification.trim(), selectedEvidenceIds);
  };

  return (
    <div className="border border-[#121212] bg-[#FFFFFF] p-5 shadow-none" id="submit-diagnosis-panel">
      {/* Title */}
      <div className="flex items-center space-x-2 pb-3 border-b border-[#121212] mb-4">
        <ClipboardCheck className="h-5 w-5 text-red-600" />
        <h3 className="font-serif italic text-lg text-[#121212]">
          Submit Final Forensic Diagnosis
        </h3>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Cause Selection */}
        <div className="space-y-1.5 font-sans">
          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#121212]/60 flex items-center gap-1.5">
            <ListFilter className="h-3.5 w-3.5 text-[#121212]/50" /> Select suspected Root Cause mechanism:
          </label>
          <select
            value={selectedCauseId}
            onChange={(e) => setSelectedCauseId(e.target.value)}
            required
            className="w-full text-xs p-2.5 border border-[#121212] bg-[#FFFFFF] text-[#121212] font-medium focus:outline-none focus:ring-1 focus:ring-[#121212]"
            id="root-cause-select"
          >
            <option value="" disabled>-- Select failure mechanism from taxonomy --</option>
            {currentCase.taxonomyCauses.map((cause) => (
              <option key={cause.id} value={cause.id}>
                {cause.name}
              </option>
            ))}
          </select>
          {selectedCauseId && (
            <div className="bg-[#F1EFE9] p-3 border border-[#121212]/15 text-[11px] text-[#121212]/80 animate-fade-in leading-relaxed">
              <strong>Mechanism Detail:</strong> {currentCase.taxonomyCauses.find(c => c.id === selectedCauseId)?.description}
            </div>
          )}
        </div>

        {/* Evidence Citations list */}
        <div className="space-y-1.5 font-sans">
          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#121212]/60 flex items-center gap-1.5">
            <CheckSquare className="h-3.5 w-3.5 text-[#121212]/50" /> Select the evidence that supports your diagnosis:
          </label>
          {unlockedEvidence.length === 0 ? (
            <div className="text-[11px] text-red-800 bg-red-50 p-3 border border-red-300 flex items-start gap-2 leading-relaxed">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>You have not unlocked any evidence files yet! An investigation submitted without unlocking any core evidence is highly likely to fail grading.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-[#F1EFE9]/40 border border-[#121212]/20">
              {unlockedEvidence.map((card) => (
                <label
                  key={card.id}
                  className={`flex items-center space-x-2 p-2 border cursor-pointer transition-all text-[11px] ${
                    selectedEvidenceIds.includes(card.id)
                      ? 'bg-[#121212] border-[#121212] text-[#F9F7F2]'
                      : 'bg-white border-[#121212]/15 hover:border-[#121212] text-[#121212]/80'
                  }`}
                  id={`cite-checkbox-label-${card.id}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedEvidenceIds.includes(card.id)}
                    onChange={() => handleToggleEvidence(card.id)}
                    className="border-[#121212]/40 text-[#121212] focus:ring-[#121212] h-3.5 w-3.5 bg-transparent"
                    id={`cite-checkbox-${card.id}`}
                  />
                  <span className="text-[9px] uppercase tracking-wider font-mono opacity-60">[{card.category}]</span>
                  <span className="truncate font-bold">{card.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Written Justification Statement */}
        <div className="space-y-1.5 font-sans">
          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#121212]/60">
            Written Analysis (for your own reflection and instructor review — not scored):
          </label>
          <textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            required
            rows={4}
            placeholder="Outline your supporting arguments citing the unlocked files. Explain how the failure initiated, propagated, and how other potential mechanisms were systematically ruled out..."
            className="w-full text-xs p-3 border border-[#121212] bg-[#F1EFE9]/10 hover:bg-[#F1EFE9]/20 text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
            id="justification-textarea"
          />
          <div className="text-[10px] text-[#121212]/50 italic leading-normal">
            Write clearly. This text does not affect the numeric score, but provides context for review.
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={!selectedCauseId || !justification.trim() || submitting}
          className={`w-full py-3 text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center space-x-2 border border-[#121212] transition-all ${
            !selectedCauseId || !justification.trim() || submitting
              ? 'bg-[#F1EFE9] text-[#121212]/40 cursor-not-allowed border-dashed'
              : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm'
          }`}
          id="submit-diagnosis-btn"
        >
          <Send className="h-4 w-4" />
          <span>{submitting ? 'PROCESSING SCORING ENGINE...' : 'SUBMIT REPORT FOR GRADING'}</span>
        </button>
      </form>
    </div>
  );
}
