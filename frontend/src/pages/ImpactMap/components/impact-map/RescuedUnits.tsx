import React from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { SimulationStage } from '../../utils/impactMapSimulationController';

interface RescuedUnitsProps {
  rescuedCount: number;
  progress?: number;
  stage?: SimulationStage;
}

export const RescuedUnits: React.FC<RescuedUnitsProps> = ({ rescuedCount, progress = 100, stage = 'COMPLETE' }) => {
  const currentCount = Math.round(rescuedCount * (progress / 100));
  const showDetail = stage === 'COMPLETE' || stage === 'MEASURE';

  return (
    <div className="bg-ink-950 border border-blood-900/30 rounded-2xl p-8 shadow-lg text-white relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blood-600/20 via-transparent to-transparent pointer-events-none transition-opacity duration-700 ${showDetail ? 'opacity-100' : 'opacity-20'}`} />
      
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <ShieldAlert className="w-5 h-5 text-blood-500" />
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          UNITS RESCUED FROM EXPIRY
        </h3>
      </div>
      
      <div className="flex items-end gap-4 mb-4 relative z-10">
        <div className="text-6xl font-editorial font-bold text-white transition-all duration-300">
          {currentCount}
        </div>
      </div>
      
      <div className={`text-xs text-ink-400 italic mb-8 relative z-10 transition-opacity duration-1000 ${showDetail ? 'opacity-100' : 'opacity-0'}`}>
        “Units that the modeled optimization redirected toward feasible network demand before their projected expiry window.”
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        {['IDENTIFIED', 'MATCHED', 'ALLOCATED', 'ROUTED', 'RESCUED'].map((step, idx, arr) => {
          const stepProgressThreshold = (idx / (arr.length - 1)) * 100;
          const isStepActive = progress >= stepProgressThreshold;
          
          return (
            <React.Fragment key={idx}>
              <div className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-widest transition-colors duration-500 ${
                isStepActive 
                  ? (idx === arr.length - 1 ? 'text-blood-400 bg-blood-900/30 px-2 py-1 rounded' : 'text-blood-500') 
                  : 'text-ink-600'
              }`}>
                {step}
              </div>
              {idx < arr.length - 1 && (
                <ArrowRight className={`w-3 h-3 hidden sm:block transition-colors duration-500 ${isStepActive ? 'text-blood-700' : 'text-ink-800'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
