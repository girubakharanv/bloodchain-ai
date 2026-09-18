import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StressTimelineProps {
  isStressed: boolean;
  propagationStages?: string[];
}

export const StressTimeline: React.FC<StressTimelineProps> = ({ isStressed, propagationStages = [] }) => {
  // If we aren't stressed, show a generic single stage
  // If we are stressed, show the dynamic propagation stages
  
  const displayStages = isStressed && propagationStages.length > 0 
    ? propagationStages 
    : ["Baseline state"];

  return (
    <div className={`bg-white border ${isStressed ? 'border-amber-200' : 'border-ink-200/50'} rounded-2xl shadow-sm p-4 transition-colors duration-500`}>
      <h3 className="text-[9px] font-bold text-ink-400 uppercase tracking-widest mb-4">
        Stress Cascade
      </h3>
      
      <div className="flex flex-wrap items-center justify-between gap-2">
        {displayStages.map((stage, idx) => {
          const isActive = isStressed && idx > 0;
          return (
            <React.Fragment key={`${stage}-${idx}`}>
              <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-500 ${
                isActive 
                  ? 'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm' 
                  : 'bg-ink-900 text-white shadow-sm'
              }`}>
                {stage}
              </div>
              {idx < displayStages.length - 1 && (
                <ArrowRight className={`w-4 h-4 transition-colors duration-500 ${
                  isStressed ? 'text-amber-400' : 'text-ink-400'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
