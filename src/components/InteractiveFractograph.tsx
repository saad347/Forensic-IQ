import { useState } from 'react';
import { VisualEvidence } from '../types';
import { Search, ZoomIn, Eye, Sun, Layers } from 'lucide-react';

interface InteractiveFractographProps {
  data: VisualEvidence;
  caseId: string;
}

export default function InteractiveFractograph({ data, caseId }: InteractiveFractographProps) {
  const [zoomActive, setZoomActive] = useState(false);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);

  // Determine which SVG pattern to render based on the caseId
  const renderMicrographPattern = () => {
    if (data.imageUrl) {
      return (
        <img 
          src={data.imageUrl} 
          alt={data.description} 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer" 
        />
      );
    }

    switch (caseId) {
      case 'shaft_fatigue_punjab':
        return (
          <svg className="w-full h-full bg-slate-900" viewBox="0 0 200 200" id="shaft-fatigue-svg">
            <defs>
              <radialGradient id="grad1" cx="50%" cy="15%" r="85%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="60%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="90" fill="url(#grad1)" stroke="#64748b" strokeWidth="2" />
            
            {/* Crack initiation site indicator */}
            <circle cx="100" cy="15" r="4" fill="#f97316" className="animate-pulse" />
            <path d="M 100 15 Q 100 20 102 22 Q 98 25 100 28" stroke="#f97316" strokeWidth="1" fill="none" />
            
            {/* Beach marks / Fatigue striation arcs */}
            <path d="M 85 20 A 15 15 0 0 0 115 20" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,1" fill="none" opacity="0.6" />
            <path d="M 75 25 A 25 25 0 0 0 125 25" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,2" fill="none" opacity="0.7" />
            <path d="M 60 35 A 40 40 0 0 0 140 35" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5,3" fill="none" opacity="0.8" />
            <path d="M 45 50 A 60 60 0 0 0 155 50" stroke="#cbd5e1" strokeWidth="1.5" fill="none" opacity="0.85" />
            <path d="M 30 70 A 80 80 0 0 0 170 70" stroke="#e2e8f0" strokeWidth="2" fill="none" opacity="0.9" />
            <path d="M 20 95 A 100 100 0 0 0 180 95" stroke="#cbd5e1" strokeWidth="1.5" fill="none" opacity="0.7" />
            
            {/* Fast fracture zone (rough fibrous crystalline) */}
            <path d="M 10 100 C 50 110, 150 110, 190 100 L 175 160 C 140 185, 60 185, 25 160 Z" fill="#334155" opacity="0.55" />
            <path d="M 10 100 Q 100 105 190 100" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2,2" fill="none" />
            
            {/* Random crystal grains in fast fracture zone */}
            <polygon points="50,130 58,126 64,134 56,138" fill="#475569" stroke="#64748b" strokeWidth="0.5" />
            <polygon points="120,150 132,145 138,154 126,158" fill="#475569" stroke="#64748b" strokeWidth="0.5" />
            <polygon points="85,160 93,155 101,162 90,167" fill="#334155" stroke="#475569" strokeWidth="0.5" />
            <polygon points="150,125 158,121 165,128 156,132" fill="#334155" stroke="#475569" strokeWidth="0.5" />
          </svg>
        );
      case 'nitrogen_bolt_cryo':
        return (
          <svg className="w-full h-full bg-slate-950" viewBox="0 0 200 200" id="cryo-bolt-svg">
            {/* Crystalline brittle cleavage facets */}
            <rect width="200" height="200" fill="#0f172a" />
            {/* Facet polygon meshes */}
            <polygon points="0,0 80,0 60,60 0,40" fill="#334155" stroke="#475569" strokeWidth="1" />
            <polygon points="80,0 200,0 170,70 60,60" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            <polygon points="0,40 60,60 40,130 0,110" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            <polygon points="60,60 170,70 140,140 40,130" fill="#475569" stroke="#64748b" strokeWidth="1" />
            <polygon points="170,70 200,0 200,100 140,140" fill="#334155" stroke="#475569" strokeWidth="1" />
            <polygon points="0,110 40,130 30,200 0,200" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            <polygon points="40,130 140,140 120,200 30,200" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            <polygon points="140,140 200,100 200,200 120,200" fill="#475569" stroke="#64748b" strokeWidth="1" />
            
            {/* River Marks running across the cleavage facets */}
            <path d="M 65 65 L 85 85 L 100 100 L 115 115 L 125 130" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.8" />
            <path d="M 90 70 L 100 100" stroke="#f97316" strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M 75 90 L 100 100" stroke="#f97316" strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M 120 95 L 115 115" stroke="#f97316" strokeWidth="1.2" fill="none" opacity="0.7" />
            <path d="M 135 110 L 125 130" stroke="#f97316" strokeWidth="1.2" fill="none" opacity="0.7" />

            {/* Flat fracture plane edge */}
            <line x1="10" y1="10" x2="190" y2="10" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
          </svg>
        );
      case 'steam_turbine_creep':
        return (
          <svg className="w-full h-full bg-slate-900" viewBox="0 0 200 200" id="creep-turbine-svg">
            <rect width="200" height="200" fill="#111827" />
            
            {/* Elongated metallographic grain structures */}
            <path d="M 10 0 C 15 30, 20 60, 10 90 C 5 120, 12 150, 15 200" stroke="#4b5563" strokeWidth="1" fill="none" />
            <path d="M 45 0 C 55 40, 50 80, 58 120 C 62 160, 55 200, 55 200" stroke="#4b5563" strokeWidth="1.2" fill="none" />
            <path d="M 90 0 C 85 30, 95 70, 90 110 C 85 150, 92 180, 90 200" stroke="#4b5563" strokeWidth="1" fill="none" />
            <path d="M 135 0 C 145 50, 138 100, 142 150 C 146 180, 139 200, 140 200" stroke="#4b5563" strokeWidth="1.2" fill="none" />
            <path d="M 175 0 C 170 30, 180 75, 175 120 C 170 160, 178 200, 175 200" stroke="#4b5563" strokeWidth="1" fill="none" />
            
            {/* Creep Cavitation Voids along high-angle grain boundary curves */}
            <circle cx="50" cy="45" r="3" fill="#000" stroke="#64748b" strokeWidth="0.5" />
            <circle cx="53" cy="55" r="4.5" fill="#000" stroke="#f97316" strokeWidth="1" />
            <circle cx="55" cy="68" r="3.5" fill="#000" stroke="#64748b" strokeWidth="0.5" />
            <circle cx="56" cy="85" r="5" fill="#000" stroke="#f97316" strokeWidth="1" />
            
            <circle cx="95" cy="110" r="4" fill="#000" stroke="#f97316" strokeWidth="0.8" />
            <circle cx="91" cy="122" r="3" fill="#000" stroke="#64748b" strokeWidth="0.5" />
            <circle cx="89" cy="135" r="5" fill="#000" stroke="#f97316" strokeWidth="1.2" />
            <circle cx="87" cy="150" r="4" fill="#000" stroke="#f97316" strokeWidth="1" />

            <circle cx="140" cy="140" r="3.5" fill="#000" stroke="#64748b" strokeWidth="0.5" />
            <circle cx="142" cy="152" r="5" fill="#000" stroke="#f97316" strokeWidth="1" />
            <circle cx="145" cy="165" r="4" fill="#000" stroke="#f97316" strokeWidth="0.8" />

            {/* Micro-cracking pathways connecting the voids */}
            <path d="M 53 50 L 56 85" stroke="#f97316" strokeWidth="1.5" strokeDasharray="1,1" fill="none" />
            <path d="M 89 120 L 87 150" stroke="#f97316" strokeWidth="1.5" strokeDasharray="1,1" fill="none" />
          </svg>
        );
      case 'weld_scc_reactor':
        return (
          <svg className="w-full h-full bg-slate-900" viewBox="0 0 200 200" id="weld-scc-svg">
            <rect width="200" height="200" fill="#1e293b" />
            
            {/* Standard grain structure */}
            <circle cx="30" cy="30" r="28" fill="none" stroke="#475569" strokeWidth="1" />
            <circle cx="75" cy="35" r="26" fill="none" stroke="#475569" strokeWidth="1" />
            <circle cx="120" cy="30" r="24" fill="none" stroke="#475569" strokeWidth="1" />
            <circle cx="165" cy="35" r="28" fill="none" stroke="#475569" strokeWidth="1" />
            <circle cx="40" cy="80" r="26" fill="none" stroke="#475569" strokeWidth="1" />
            <circle cx="85" cy="85" r="24" fill="none" stroke="#475569" strokeWidth="1" />
            <circle cx="130" cy="80" r="28" fill="none" stroke="#475569" strokeWidth="1" />
            <circle cx="170" cy="90" r="25" fill="none" stroke="#475569" strokeWidth="1" />
            <circle cx="35" cy="135" r="28" fill="none" stroke="#475569" strokeWidth="1" />
            <circle cx="80" cy="140" r="26" fill="none" stroke="#475569" strokeWidth="1" />
            <circle cx="125" cy="135" r="24" fill="none" stroke="#475569" strokeWidth="1" />
            <circle cx="175" cy="145" r="28" fill="none" stroke="#475569" strokeWidth="1" />

            {/* Highly Branched "Lightning" Stress Corrosion Cracks cutting transgranularly */}
            <path d="M 10 15 L 45 42 L 68 35 L 90 75 L 125 72 L 145 105 L 175 110" stroke="#f97316" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Side branch cracks */}
            <path d="M 45 42 L 35 68 L 50 85" stroke="#f97316" strokeWidth="1.5" fill="none" />
            <path d="M 90 75 L 80 110 Q 70 120 55 125" stroke="#f97316" strokeWidth="1.2" fill="none" />
            <path d="M 125 72 L 138 50 L 155 45" stroke="#f97316" strokeWidth="1.5" fill="none" />
            <path d="M 145 105 L 135 140 L 150 165" stroke="#f97316" strokeWidth="1.8" fill="none" />
            <path d="M 115 130 L 122 155" stroke="#f97316" strokeWidth="1" fill="none" />

            {/* Pinhole initiation marker */}
            <circle cx="10" cy="15" r="3" fill="#ef4444" />
          </svg>
        );
      case 'conveyor_abrasive_wear':
        return (
          <svg className="w-full h-full bg-slate-900" viewBox="0 0 200 200" id="wear-conveyor-svg">
            <rect width="200" height="200" fill="#1e293b" />
            
            {/* Deep, parallel, grinding gouges running vertically */}
            <line x1="20" y1="0" x2="20" y2="200" stroke="#475569" strokeWidth="1.5" />
            <line x1="32" y1="0" x2="32" y2="200" stroke="#cbd5e1" strokeWidth="2" opacity="0.4" />
            <line x1="45" y1="0" x2="45" y2="200" stroke="#334155" strokeWidth="3" />
            <line x1="50" y1="0" x2="50" y2="200" stroke="#f97316" strokeWidth="1" opacity="0.6" />
            <line x1="68" y1="0" x2="68" y2="200" stroke="#475569" strokeWidth="1" />
            <line x1="82" y1="0" x2="82" y2="200" stroke="#cbd5e1" strokeWidth="2.5" opacity="0.5" />
            <line x1="95" y1="0" x2="95" y2="200" stroke="#334155" strokeWidth="2" />
            
            <line x1="110" y1="0" x2="110" y2="200" stroke="#f97316" strokeWidth="1.5" opacity="0.7" />
            <line x1="125" y1="0" x2="125" y2="200" stroke="#475569" strokeWidth="3" />
            <line x1="138" y1="0" x2="138" y2="200" stroke="#cbd5e1" strokeWidth="1" opacity="0.3" />
            <line x1="150" y1="0" x2="150" y2="200" stroke="#334155" strokeWidth="2" />
            <line x1="165" y1="0" x2="165" y2="200" stroke="#475569" strokeWidth="1.5" />
            <line x1="180" y1="0" x2="180" y2="200" stroke="#f97316" strokeWidth="2" opacity="0.5" />

            {/* Embedded sand/silica particles inside the gouges */}
            <polygon points="43,80 47,75 51,82 45,86" fill="#f59e0b" stroke="#fff" strokeWidth="0.5" />
            <polygon points="108,120 114,115 111,123" fill="#f59e0b" stroke="#fff" strokeWidth="0.5" />
            <polygon points="178,40 183,38 181,44" fill="#f59e0b" stroke="#fff" strokeWidth="0.5" />
          </svg>
        );
      case 'boiler_ductile_overload':
        return (
          <svg className="w-full h-full bg-slate-900" viewBox="0 0 200 200" id="boiler-overload-svg">
            <defs>
              <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="85%" stopColor="#374151" />
                <stop offset="100%" stopColor="#4b5563" />
              </radialGradient>
            </defs>
            <rect width="200" height="200" fill="url(#grad2)" />
            
            {/* The GAPING thin-lipped lens shape - Fish Mouth Rupture */}
            <path d="M 20 100 Q 100 35 180 100 Q 100 165 20 100 Z" fill="#030712" stroke="#ef4444" strokeWidth="2" />
            
            {/* Necking deformation bands along the lip edge */}
            <path d="M 20 100 Q 100 45 180 100" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.8" />
            <path d="M 20 100 Q 100 50 180 100" stroke="#cbd5e1" strokeWidth="1" fill="none" opacity="0.4" />
            <path d="M 20 100 Q 100 155 180 100" stroke="#f97316" strokeWidth="1.5" fill="none" opacity="0.8" />
            
            {/* SEM Dimples inside the torn necking metal (microvoid coalescence pattern) */}
            <circle cx="60" cy="55" r="2.5" fill="none" stroke="#4b5563" strokeWidth="0.5" />
            <circle cx="80" cy="50" r="3.5" fill="none" stroke="#64748b" strokeWidth="0.5" />
            <circle cx="100" cy="48" r="4.5" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
            <circle cx="120" cy="50" r="3" fill="none" stroke="#64748b" strokeWidth="0.5" />
            <circle cx="140" cy="57" r="2" fill="none" stroke="#4b5563" strokeWidth="0.5" />
            
            <circle cx="55" cy="145" r="3" fill="none" stroke="#4b5563" strokeWidth="0.5" />
            <circle cx="75" cy="148" r="4" fill="none" stroke="#64748b" strokeWidth="0.5" />
            <circle cx="100" cy="151" r="5" fill="none" stroke="#94a3b8" strokeWidth="0.8" />
            <circle cx="125" cy="149" r="3.5" fill="none" stroke="#64748b" strokeWidth="0.5" />
            <circle cx="145" cy="144" r="2.5" fill="none" stroke="#4b5563" strokeWidth="0.5" />

            {/* Vapor blast waves */}
            <path d="M 40 100 Q 100 80 160 100" stroke="#3b82f6" strokeWidth="1" fill="none" strokeDasharray="3,3" opacity="0.5" />
            <path d="M 50 105 Q 100 115 150 105" stroke="#3b82f6" strokeWidth="1" fill="none" strokeDasharray="3,3" opacity="0.5" />
          </svg>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500 font-mono text-xs">
            MICROGRAPH DIAGRAM NOT CONFIGURED
          </div>
        );
    }
  };

  return (
    <div className="border border-[#121212] bg-[#F1EFE9]/30 p-5 shadow-none" id="interactive-fractograph">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-[#121212] gap-2">
        <div className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-red-600" />
          <span className="font-serif italic text-base text-[#121212]">
            Virtual Metallographic Micrograph
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-[#121212]/60 font-mono text-[10px] font-bold uppercase tracking-wider">Zoom: {zoomActive ? '10,000x (SEM)' : 'Stereo View'}</span>
          <button
            onClick={() => setZoomActive(!zoomActive)}
            className={`px-3 py-1.5 border text-xs font-bold font-mono uppercase tracking-widest transition-all cursor-pointer ${
              zoomActive
                ? 'bg-red-600 border-[#121212] text-white'
                : 'bg-white hover:bg-[#F1EFE9] border-[#121212] text-[#121212]'
            }`}
            id="zoom-toggle-btn"
          >
            <ZoomIn className="h-3.5 w-3.5 inline mr-1" />
            <span>{zoomActive ? 'Stereo' : 'SEM Zoom'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* The Viewport Stage */}
        <div className="lg:col-span-3 relative bg-slate-950 overflow-hidden border border-[#121212] flex items-center justify-center min-h-[300px]">
          {/* Apply CSS filters dynamically */}
          <div 
            className="w-full h-full max-w-[400px] max-h-[400px] aspect-square transition-all duration-300"
            style={{ 
              filter: `contrast(${contrast}%) brightness(${brightness}%)`,
              transform: zoomActive ? 'scale(1.45)' : 'scale(1)'
            }}
          >
            {renderMicrographPattern()}
          </div>

          {/* Interactive Annotation Hotspots Overlay */}
          {!zoomActive && data.annotations && data.annotations.map((ann, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAnnotation(selectedAnnotation === ann.label ? null : ann.label)}
              className="absolute w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center border border-white shadow-md text-xs font-mono font-bold transition-all transform hover:scale-125 animate-bounce"
              style={{ left: `${ann.x}%`, top: `${ann.y}%` }}
              title={ann.label}
              id={`hotspot-${idx}`}
            >
              {idx + 1}
            </button>
          ))}

          {/* Magnifier Glass overlay representation */}
          {zoomActive && (
            <div className="absolute inset-0 border-4 border-red-600/30 pointer-events-none flex items-center justify-center">
              <div className="bg-[#121212] text-[#F9F7F2] font-mono text-[9px] font-bold tracking-widest px-2.5 py-0.5 absolute top-2 right-2 border border-red-600/50 uppercase">
                SEM IMAGING MODE ACTIVE
              </div>
            </div>
          )}
        </div>

        {/* Controls Sidebar */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[9px] font-mono font-bold text-[#121212]/50 uppercase tracking-widest block">
              Image Fine-Tuning
            </span>
            
            {/* Brightness Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#121212]/80 font-mono text-[10px]">
                <span className="flex items-center gap-1 font-bold uppercase tracking-wider">
                  <Sun className="h-3 w-3 text-red-600" /> Brightness
                </span>
                <span className="font-bold">{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-[#121212] h-1 bg-[#121212]/10 cursor-pointer"
                id="brightness-slider"
              />
            </div>

            {/* Contrast Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#121212]/80 font-mono text-[10px]">
                <span className="flex items-center gap-1 font-bold uppercase tracking-wider">
                  <Layers className="h-3 w-3 text-red-600" /> Contrast
                </span>
                <span className="font-bold">{contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-[#121212] h-1 bg-[#121212]/10 cursor-pointer"
                id="contrast-slider"
              />
            </div>
          </div>

          {/* Description details card */}
          <div className="bg-[#FFFFFF] p-3.5 border border-[#121212]/15 space-y-2 text-xs">
            <h4 className="font-serif italic text-sm text-[#121212] flex items-center gap-1">
              <Search className="h-3.5 w-3.5 text-red-600" />
              <span>Observation Notes</span>
            </h4>
            <p className="text-[#121212]/80 leading-relaxed text-[11px] font-sans">
              {zoomActive && data.zoomDetails ? data.zoomDetails : data.description}
            </p>
          </div>
        </div>
      </div>

      {/* Floating Callout explanation for active hotspots */}
      {selectedAnnotation && (
        <div className="mt-3 bg-red-50/40 border border-red-300 p-3.5 flex justify-between items-start animate-fade-in" id="hotspot-callout">
          <div className="text-xs text-red-950 font-serif leading-relaxed">
            <strong className="font-sans text-[10px] font-mono font-bold uppercase tracking-widest text-red-800 block mb-0.5">Hotspot Observation</strong>
            <span className="italic">"{selectedAnnotation}"</span>
          </div>
          <button 
            onClick={() => setSelectedAnnotation(null)}
            className="text-xs text-red-400 hover:text-red-700 font-mono font-bold ml-2 px-1 text-base cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
