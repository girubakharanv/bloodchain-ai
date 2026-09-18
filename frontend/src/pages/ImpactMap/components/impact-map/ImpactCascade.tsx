import React from 'react';
import { Network, ArrowDown } from 'lucide-react';
import { SimulationStage } from '../../utils/impactMapSimulationController';

interface ImpactCascadeProps {
  currentStage?: SimulationStage;
}

export const ImpactCascade: React.FC<ImpactCascadeProps> = ({ currentStage = 'COMPLETE' }) => {
  const cascadeSteps = [
    { label: 'PREDICTED DEMAND', outcome: 'better visibility', active: ['PREDICT', 'SIMULATE', 'DECIDE', 'VERIFY', 'OPTIMIZE', 'MEASURE', 'COMPLETE'] },
    { label: 'COLLECTION PLANNING', outcome: 'targeted drives', active: ['PREDICT', 'SIMULATE', 'DECIDE', 'VERIFY', 'OPTIMIZE', 'MEASURE', 'COMPLETE'] },
    { label: 'INVENTORY POSITION', outcome: 'reserve protected', active: ['SIMULATE', 'DECIDE', 'VERIFY', 'OPTIMIZE', 'MEASURE', 'COMPLETE'] },
    { label: 'ALLOCATION', outcome: 'reduced conflict', active: ['DECIDE', 'VERIFY', 'OPTIMIZE', 'MEASURE', 'COMPLETE'] },
    { label: 'ROUTE SELECTION', outcome: 'improved feasibility', active: ['ROUTE', 'VERIFY', 'OPTIMIZE', 'MEASURE', 'COMPLETE'] },
    { label: 'COLD-CHAIN MONITORING', outcome: 'reduced transport risk', active: ['VERIFY', 'OPTIMIZE', 'MEASURE', 'COMPLETE'] }
  ];

  const STAGE_ORDER = ['BASELINE', 'PREDICT', 'SIMULATE', 'DECIDE', 'ROUTE', 'VERIFY', 'OPTIMIZE', 'MEASURE', 'COMPLETE'];
  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-8 shadow-sm h-full animate-fade-in relative transition-opacity duration-500">
      <div className="flex items-center gap-2 mb-8 border-b border-ink-100 pb-4 relative z-10">
        <Network className="w-5 h-5 text-ink-400" />
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">
          IMPACT CASCADE
        </h3>
      </div>

      <div className="flex flex-col items-center relative z-10">
        <div className="absolute top-0 bottom-24 left-1/2 w-0.5 bg-ink-100 -translate-x-1/2 -z-10" />
        
        {cascadeSteps.map((step, idx) => {
          const isActive = step.active.includes(currentStage);
          
          return (
            <React.Fragment key={idx}>
              <div className={`bg-white border rounded-lg py-3 px-6 text-center shadow-sm relative group w-64 transition-all duration-500 ${
                isActive ? 'border-blood-300 shadow-[0_0_15px_rgba(220,38,38,0.15)] scale-105' : 'border-ink-200 opacity-40'
              }`}>
                <div className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  isActive ? 'text-blood-800' : 'text-ink-500'
                }`}>
                  {step.label}
                </div>
                <div className={`absolute right-[-140px] top-1/2 -translate-y-1/2 flex items-center gap-2 transition-opacity whitespace-nowrap ${
                  isActive && currentStage === 'COMPLETE' ? 'opacity-100' : 'opacity-0'
                }`}>
                  <ArrowRightIcon className="w-3 h-3 text-ink-300" />
                  <span className="text-[9px] font-bold text-ink-500 uppercase tracking-widest bg-ink-50 px-2 py-1 rounded">
                    {step.outcome}
                  </span>
                </div>
              </div>
              
              {idx < cascadeSteps.length - 1 && (
                <div className="py-2 text-ink-300 bg-white z-10">
                  <ArrowDown className={`w-4 h-4 transition-colors ${isActive ? 'text-blood-400' : 'text-ink-200'}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}

        <div className={`mt-8 bg-ink-900 border border-ink-800 text-white rounded-lg py-4 px-8 text-center shadow-lg w-full max-w-xs relative overflow-hidden transition-all duration-1000 ${
          currentStage === 'COMPLETE' || currentStage === 'MEASURE' ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4'
        }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blood-600/30 via-transparent to-transparent pointer-events-none" />
          <div className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-1 relative z-10">
            NETWORK OUTCOME
          </div>
          <div className="text-lg font-bold relative z-10">
            LOWER OPERATIONAL RISK
          </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
