import { EvidenceCard, EvidenceCategory } from '../types';
import { Lock, Eye, CheckCircle, HelpCircle, FileText, UserCheck, Wrench, BarChart2, Disc } from 'lucide-react';
import InteractiveFractograph from './InteractiveFractograph';
import TelemetryChart from './TelemetryChart';

interface EvidenceGridProps {
  evidence: EvidenceCard[];
  caseId: string;
  hasHypotheses: boolean;
  budget: number;
  onUnlock: (id: string, cost: number) => void;
}

export default function EvidenceGrid({ evidence, caseId, hasHypotheses, budget, onUnlock }: EvidenceGridProps) {

  // Map category to icon
  const getCategoryIcon = (category: EvidenceCategory) => {
    switch (category) {
      case 'visual': return <Eye className="h-4 w-4 text-red-600" />;
      case 'sensor': return <BarChart2 className="h-4 w-4 text-[#121212]" />;
      case 'maintenance': return <Wrench className="h-4 w-4 text-red-600" />;
      case 'material': return <Disc className="h-4 w-4 text-[#121212]" />;
      case 'witness': return <UserCheck className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-[#121212]/70" />;
    }
  };

  return (
    <div className="space-y-6" id="evidence-board">
      <div className="flex items-center justify-between border-b border-[#121212] pb-3">
        <h3 className="font-serif italic text-2xl text-[#121212] flex items-center space-x-2">
          <HelpCircle className="h-5 w-5 text-red-600" />
          <span>Evidence Files Board</span>
        </h3>
        <span className="text-xs text-[#121212]/60 font-mono font-bold uppercase tracking-wider">
          UNLOCKED: {evidence.filter(e => e.unlocked).length} / {evidence.length}
        </span>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {evidence.map((card) => {
          return (
            <div
              key={card.id}
              className={`border transition-all relative overflow-hidden ${
                card.unlocked
                  ? 'border-[#121212] bg-[#FFFFFF]'
                  : 'border-[#121212] bg-[#F1EFE9]/40 hover:bg-[#F1EFE9]/60'
              }`}
              id={`evidence-card-${card.id}`}
            >
              {/* Card Header */}
              <div className="p-4 flex items-start justify-between border-b border-[#121212] bg-[#F1EFE9]">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 bg-white border border-[#121212] flex items-center justify-center">
                    {getCategoryIcon(card.category)}
                  </div>
                  <div>
                    <h4 className="text-[9px] font-bold font-mono text-[#121212]/60 uppercase tracking-widest leading-none mb-1">
                      {card.category} file
                    </h4>
                    <h5 className="text-sm font-bold text-[#121212] leading-none">{card.name}</h5>
                  </div>
                </div>
                {card.unlocked ? (
                  <span className="flex items-center text-xs text-emerald-800 font-mono font-bold uppercase tracking-wide">
                    <CheckCircle className="h-4 w-4 mr-1 text-emerald-600" /> Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 uppercase tracking-wider">
                    ⚡ COST: {card.cost} PTS
                  </span>
                )}
              </div>

              {/* Card Body / Unlock Prompt */}
              <div className="p-4">
                {card.unlocked ? (
                  /* Render detailed unlocked evidence based on category */
                  <div className="space-y-4 animate-fade-in">
                    
                    {/* Visual Category */}
                    {card.category === 'visual' && card.visualData && (
                      <InteractiveFractograph data={card.visualData} caseId={caseId} />
                    )}

                    {/* Sensor Category */}
                    {card.category === 'sensor' && card.sensorData && (
                      <TelemetryChart data={card.sensorData} />
                    )}

                    {/* Maintenance Log Category */}
                    {card.category === 'maintenance' && card.maintenanceData && (
                      <div className="border border-[#121212] overflow-hidden bg-white text-xs">
                        <table className="w-full divide-y divide-[#121212]/20">
                          <thead className="bg-[#F1EFE9]">
                            <tr>
                              <th className="px-3 py-2 text-left font-mono text-[9px] text-[#121212]/80 uppercase font-bold tracking-wider">Date</th>
                              <th className="px-3 py-2 text-left font-mono text-[9px] text-[#121212]/80 uppercase font-bold tracking-wider">Technician</th>
                              <th className="px-3 py-2 text-left font-mono text-[9px] text-[#121212]/80 uppercase font-bold tracking-wider">Action / Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#121212]/10 bg-white">
                            {card.maintenanceData.map((log, index) => (
                              <tr key={index} className={log.flagged ? 'bg-red-50/50' : ''}>
                                <td className="px-3 py-2 font-mono text-[#121212]/80 whitespace-nowrap">{log.date}</td>
                                <td className="px-3 py-2 font-bold text-[#121212] whitespace-nowrap">{log.technician}</td>
                                <td className="px-3 py-2 text-[#121212]/80">
                                  <p className="font-sans font-medium">{log.action}</p>
                                  <p className="text-[11px] text-[#121212]/60 mt-0.5 font-serif italic">"{log.notes}"</p>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Material certification category */}
                    {card.category === 'material' && card.materialData && (
                      <div className="space-y-3 bg-[#FFFFFF] p-3 border border-[#121212]/15 text-xs">
                        <div className="flex justify-between items-center pb-2 border-b border-[#121212]/10">
                          <span className="font-serif italic text-[#121212] text-sm">Specified Alloy Grade:</span>
                          <span className="font-mono bg-[#121212] text-[#F9F7F2] px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                            {card.materialData.alloyName}
                          </span>
                        </div>
                        <table className="w-full divide-y divide-[#121212]/10 text-xs">
                          <thead>
                            <tr className="text-left text-[#121212]/50 font-mono text-[9px] uppercase tracking-wider">
                              <th className="py-1">Property/Composition</th>
                              <th className="py-1">Spec Threshold</th>
                              <th className="py-1">Actual Lab Test</th>
                              <th className="py-1 text-right">Verification</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#121212]/10">
                            {card.materialData.properties.map((prop, idx) => (
                              <tr key={idx}>
                                <td className="py-1.5 font-bold text-[#121212]">{prop.elementOrProperty}</td>
                                <td className="py-1.5 font-mono text-[#121212]/70">{prop.specified}</td>
                                <td className="py-1.5 font-mono font-bold text-[#121212]">{prop.actual}</td>
                                <td className="py-1.5 text-right">
                                  <span className={`px-1.5 py-0.5 border font-mono text-[9px] font-bold uppercase ${
                                    prop.status === 'Pass' 
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                                      : prop.status === 'Fail' 
                                        ? 'bg-red-50 text-red-800 border-red-300' 
                                        : 'bg-amber-50 text-amber-800 border-amber-300'
                                  }`}>
                                    {prop.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {card.materialData.microhardness && (
                          <div className="bg-[#F1EFE9] p-2.5 text-[11px] text-[#121212]/80 border-t border-[#121212]/10">
                            <strong>Microhardness Evaluation:</strong> {card.materialData.microhardness}
                          </div>
                        )}
                        <div className="text-[10px] text-[#121212]/60 italic font-serif">
                          <strong>Metallurgical Notes:</strong> {card.materialData.notes}
                        </div>
                      </div>
                    )}

                    {/* Witness Statements category */}
                    {card.category === 'witness' && card.witnessData && (
                      <div className="bg-[#F1EFE9] p-4 border border-[#121212]/15 flex items-start gap-3">
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-[#121212]">{card.witnessData.witnessName}</span>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#121212]/60 bg-white border border-[#121212]/10 px-1.5 py-0.5">
                              {card.witnessData.role}
                            </span>
                          </div>
                          <p className="text-xs text-[#121212] leading-relaxed italic font-serif">
                            "{card.witnessData.statement}"
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  /* Locked state */
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-[#FFFFFF]">
                    <div className="p-3 bg-[#F1EFE9] border border-[#121212] mb-3">
                      <Lock className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-xs text-[#121212] font-bold uppercase tracking-wider mb-1 font-mono">
                      {card.shortSummary}
                    </p>
                    <p className="text-[11px] text-[#121212]/60 mb-5 max-w-sm leading-relaxed font-sans">
                      Unlocking this scientific evidence dossier consumes {card.cost} points from your active investigator budget.
                    </p>
                    <button
                      onClick={() => onUnlock(card.id, card.cost)}
                      className="px-5 py-3 bg-[#121212] hover:bg-[#121212]/90 text-[#F9F7F2] text-xs font-bold uppercase tracking-[0.2em] border border-[#121212] flex items-center space-x-2.5 transition-all cursor-pointer"
                      id={`unlock-btn-${card.id}`}
                    >
                      <span>Unlock Dossier</span>
                      <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 font-mono font-bold">
                        ⚡ {card.cost} PTS
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
