import React, { useState } from 'react';
import { Hypothesis } from '../types';
import { FileEdit, ClipboardList, PlusCircle, History } from 'lucide-react';

interface HypothesisPanelProps {
  hypotheses: Hypothesis[];
  unlockedCount: number;
  onAddHypothesis: (text: string) => void;
}

export default function HypothesisPanel({ hypotheses, unlockedCount, onAddHypothesis }: HypothesisPanelProps) {
  const [newText, setNewText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddHypothesis(newText.trim());
    setNewText('');
  };

  return (
    <div className="border border-[#121212] bg-[#FFFFFF] p-5 shadow-none" id="hypothesis-tracker-panel">
      {/* Title */}
      <div className="flex items-center space-x-2 pb-3 border-b border-[#121212] mb-4">
        <ClipboardList className="h-5 w-5 text-red-600" />
        <h3 className="font-serif italic text-lg text-[#121212]">
          Working Hypothesis Log
        </h3>
      </div>

      <div className="space-y-4">
        {/* Helper Notice about protocol enforcement */}
        <div className="bg-[#F1EFE9] text-[#121212] p-4 border-l-4 border-red-600 text-[11px] leading-relaxed">
          <strong>Strict Forensics Protocol:</strong> You are required to log at least one active hypothesis before you can spend points to unlock further evidence. This promotes disciplined, evidence-based reasoning over guessing.
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#121212]/60 flex items-center gap-1.5">
            <FileEdit className="h-3.5 w-3.5 text-[#121212]/50" /> Record New Hypothesis or Observation
          </label>
          <div className="relative">
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="e.g., The flat fracture face and river marks suggest low-temp cleavage, possibly brittle failure due to winter cold..."
              rows={3}
              className="w-full text-xs p-3 border border-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212] bg-[#F1EFE9]/10 hover:bg-[#F1EFE9]/20 transition-all placeholder-[#121212]/40 text-[#121212]"
              id="hypothesis-textarea"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold uppercase text-[#121212]/40">
              Unlocked: {unlockedCount} card{unlockedCount !== 1 ? 's' : ''}
            </span>
            <button
              type="submit"
              disabled={!newText.trim()}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] flex items-center space-x-1 border border-[#121212] transition-all cursor-pointer ${
                newText.trim()
                  ? 'bg-[#121212] text-white'
                  : 'bg-[#F1EFE9] text-[#121212]/40 cursor-not-allowed border-dashed'
              }`}
              id="log-hypothesis-btn"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Log Hypothesis</span>
            </button>
          </div>
        </form>

        {/* Saved Hypotheses List */}
        <div className="pt-3 border-t border-[#121212]/15 space-y-3">
          <div className="flex items-center space-x-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[#121212]/60">
            <History className="h-3.5 w-3.5 text-red-600" />
            <span>Hypothesis History ({hypotheses.length})</span>
          </div>

          {hypotheses.length === 0 ? (
            <div className="text-center py-6 border-2 border-dashed border-[#121212]/20 text-xs text-[#121212]/50 italic font-serif">
              No hypotheses logged yet. Type one above to begin unlocking files!
            </div>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1 font-sans">
              {hypotheses.slice().reverse().map((hyp, index) => {
                const chronologicalIndex = hypotheses.length - index;
                return (
                  <div
                    key={hyp.id}
                    className="p-3 bg-[#F1EFE9]/30 border border-[#121212]/20 space-y-1.5 animate-fade-in text-xs"
                    id={`logged-hypothesis-${hyp.id}`}
                  >
                    <div className="flex justify-between items-center text-[9px] font-mono font-bold text-[#121212]/50">
                      <span className="font-bold text-red-600 uppercase">
                        REVISION #{chronologicalIndex}
                      </span>
                      <span>
                        {hyp.timestamp} • UNLOCKED: {hyp.unlockedEvidenceCount}
                      </span>
                    </div>
                    <p className="text-[#121212] leading-relaxed italic font-serif">
                      "{hyp.text}"
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
