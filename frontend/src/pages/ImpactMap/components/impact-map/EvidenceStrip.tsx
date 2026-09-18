import React from 'react';
import { Link2 } from 'lucide-react';
import { AttributionModule } from '../../types/impactMap';

interface EvidenceStripProps {
  attribution: AttributionModule[];
}

export const EvidenceStrip: React.FC<EvidenceStripProps> = ({ attribution }) => {
  return (
    <div className="bg-ink-950 border border-ink-900 rounded-xl p-4 shadow-sm animate-fade-in flex flex-col md:flex-row items-center justify-between gap-4 overflow-x-auto">
      <div className="flex items-center gap-2 text-[10px] font-bold text-ink-500 uppercase tracking-widest flex-shrink-0">
        <Link2 className="w-4 h-4" /> EVIDENCE LAYER
      </div>
      
      <div className="flex items-center gap-4 min-w-max">
        {attribution.map((mod, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-ink-900 border border-ink-800 rounded px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
            <div className="text-[10px] font-bold text-ink-300 uppercase tracking-widest">
              {mod.name.replace('™', '')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
