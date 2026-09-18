import React from 'react';
import { Layers } from 'lucide-react';
import { AttributionModule } from '../../types/impactMap';

interface ImpactAttributionProps {
  attribution: AttributionModule[];
  show?: boolean;
}

export const ImpactAttribution: React.FC<ImpactAttributionProps> = ({ attribution, show = true }) => {
  return (
    <div className={`bg-ink-950 border border-ink-900 rounded-2xl p-8 shadow-xl h-full text-white transition-all duration-1000 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
      <div className="flex items-center gap-2 mb-8 border-b border-ink-800 pb-4">
        <Layers className="w-5 h-5 text-ink-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          WHAT CAUSED THE IMPROVEMENT?
        </h3>
      </div>

      <div className="space-y-4">
        {attribution.map((mod, idx) => (
          <div key={idx} className="flex flex-col gap-1.5" style={{ transitionDelay: `${idx * 100}ms` }}>
            <div className="flex justify-between items-end">
              <div className="text-sm font-bold text-white group-hover:text-blood-400 transition-colors">
                {mod.name}
              </div>
              <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">
                {mod.impactArea}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-grow bg-ink-900 rounded-full h-2 overflow-hidden flex">
                <div className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  mod.contribution === 'HIGH CONTRIBUTION' ? 'bg-blood-600' :
                  mod.contribution === 'MEDIUM CONTRIBUTION' ? 'bg-blood-800' :
                  mod.contribution === 'LOW CONTRIBUTION' ? 'bg-ink-700' :
                  'bg-ink-800'
                }`} style={{
                  width: show ? (
                    mod.contribution === 'HIGH CONTRIBUTION' ? '100%' :
                    mod.contribution === 'MEDIUM CONTRIBUTION' ? '66%' :
                    mod.contribution === 'LOW CONTRIBUTION' ? '33%' :
                    '16%'
                  ) : '0%'
                }} />
              </div>
              
              <div className={`text-[9px] font-bold uppercase tracking-widest w-32 text-right transition-opacity duration-1000 delay-500 ${show ? 'opacity-100' : 'opacity-0'} ${
                mod.contribution === 'HIGH CONTRIBUTION' ? 'text-blood-400' :
                mod.contribution === 'MEDIUM CONTRIBUTION' ? 'text-blood-600' :
                'text-ink-500'
              }`}>
                {mod.contribution}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
