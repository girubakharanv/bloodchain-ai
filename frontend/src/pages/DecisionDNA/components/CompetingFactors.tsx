import React from 'react';
import { Plus, Minus, Scale } from 'lucide-react';
import { DecisionDriver, AlternativeDecision, DecisionRecord } from '../types/decisionDna';

interface CompetingFactorsProps {
  drivers: DecisionDriver[];
  alternative: AlternativeDecision | null;
  decision: DecisionRecord;
  currentStage?: number;
}

export const CompetingFactors: React.FC<CompetingFactorsProps> = ({ drivers, alternative, decision, currentStage = 7 }) => {
  const isVisible = currentStage >= 4;

  const pushesUp = drivers.filter(d => d.direction === 'UP');
  const pushesDown = drivers.filter(d => d.direction === 'DOWN');

  return (
    <div className={`bg-white border border-ink-200 rounded-2xl p-8 shadow-sm h-full transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4 pointer-events-none'
    }`}>
      <div className="flex items-center gap-2 mb-8 border-b border-ink-100 pb-4">
        <Scale className="w-5 h-5 text-ink-400" />
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">
          COMPETING FACTORS
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Decorative center divider */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-ink-100 -translate-x-1/2" />
        
        {/* Pushes Up */}
        <div>
          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Plus className="w-3 h-3" /> PUSHES PRIORITY UP
          </div>
          <div className="flex flex-col gap-3">
            {pushesUp.length > 0 ? pushesUp.map(driver => (
              <div key={driver.id} className="flex items-start gap-2 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                <Plus className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold text-ink-900">{driver.name}</div>
                  <div className="text-xs text-ink-500">{driver.description}</div>
                </div>
              </div>
            )) : (
              <div className="text-xs text-ink-400 italic">No positive priority drivers identified.</div>
            )}
          </div>
        </div>
        
        {/* Pushes Down */}
        <div>
          <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Minus className="w-3 h-3" /> PUSHES PRIORITY DOWN
          </div>
          <div className="flex flex-col gap-3">
            {pushesDown.length > 0 ? pushesDown.map(driver => (
              <div key={driver.id} className="flex items-start gap-2 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                <Minus className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold text-ink-900">{driver.name}</div>
                  <div className="text-xs text-ink-500">{driver.description}</div>
                </div>
              </div>
            )) : (
              <div className="text-xs text-ink-400 italic">No negative constraints identified.</div>
            )}
          </div>
        </div>
      </div>
      
      {alternative && (
        <div className="mt-8 pt-6 border-t border-ink-100 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-2 text-center md:text-left">
              RECOMMENDED DECISION ({decision.strength})
            </div>
            <div className="text-sm font-bold text-ink-900 mb-2">
              {decision.recommendation}
            </div>
            <ul className="list-disc pl-4 text-xs text-ink-600 space-y-1">
              {alternative.whyRecommendedHigher.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-2 text-center md:text-left">
              ALTERNATIVE ({alternative.strength})
            </div>
            <div className="text-sm font-bold text-ink-700 mb-2">
              {alternative.recommendation}
            </div>
            <ul className="list-disc pl-4 text-xs text-ink-500 space-y-1">
              {alternative.whyAlternativeLower.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center">
        <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-2">
          FINAL BALANCE
        </div>
        <div className="px-6 py-2 bg-ink-900 text-white rounded-full text-sm font-bold tracking-widest uppercase shadow-md text-center max-w-full truncate" title={decision.recommendation}>
          {decision.recommendation}
        </div>
      </div>
    </div>
  );
};
