import React, { useState } from 'react';
import type { SimulationResult } from '../simulationEngine';
import { ShieldCheck, ChevronRight, CornerDownRight } from 'lucide-react';

interface SimulationInsightProps {
  insight: SimulationResult['insight'];
}

export const SimulationInsight: React.FC<SimulationInsightProps> = ({ insight }) => {
  const [showDna, setShowDna] = useState(false);

  return (
    <div className="bg-white border border-ink-200/40 rounded shadow-sm flex flex-col h-full">
      <div className="p-4 border-b border-ink-200/40 bg-paper/50">
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">Time Machine Insight</h3>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-1">Predicted Impact</div>
            <p className="text-sm text-ink-900 font-medium leading-relaxed">
              {insight.message}
            </p>
            {insight.reasons.length > 0 && (
              <ul className="mt-2 space-y-1">
                {insight.reasons.map((r, i) => (
                  <li key={i} className="text-xs text-ink-600 flex items-start gap-1">
                     <span className="text-orange-500 mt-0.5">•</span> {r}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-blood-50 border border-blood-100 rounded p-3">
             <div className="flex items-start gap-2">
               <ShieldCheck className="text-blood-700 mt-0.5 shrink-0" size={16} />
               <div>
                 <h4 className="text-xs font-bold text-blood-900 mb-1 uppercase tracking-wider">Recommended Review</h4>
                 <p className="text-xs text-blood-800/90 leading-relaxed">
                   {insight.recommendation}
                 </p>
               </div>
             </div>
          </div>
        </div>

        {/* Decision DNA */}
        <div className="mt-6 border-t border-ink-100 pt-4">
          {showDna ? (
            <div className="animate-fade-in">
              <h4 className="text-xs font-bold text-ink-900 mb-3">Decision DNA</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-24 text-ink-500 truncate">Demand Impact</span>
                  <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blood-600" style={{ width: `${insight.decisionDna.demandImpact}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-ink-500 truncate">Supply Reduce</span>
                  <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${insight.decisionDna.supplyReduction}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-ink-500 truncate">Logistics Delay</span>
                  <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400" style={{ width: `${insight.decisionDna.transportDelay}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-ink-500 truncate">Reserve Exp.</span>
                  <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blood-700" style={{ width: `${insight.decisionDna.reserveExposure}%` }} />
                  </div>
                </div>
              </div>
              <button onClick={() => setShowDna(false)} className="mt-3 text-[10px] font-bold text-ink-400 hover:text-ink-900 transition-colors">
                Close Reasoning
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowDna(true)}
              className="w-full flex items-center justify-between text-xs font-bold text-ink-500 hover:text-ink-900 transition-colors uppercase tracking-widest"
            >
              Why this recommendation? <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
