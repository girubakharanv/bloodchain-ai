import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowRight, Activity } from 'lucide-react';
import { CounterfactualScenario, DecisionRecord, AlternativeDecision } from '../types/decisionDna';

interface CounterfactualPreviewProps {
  scenarios: CounterfactualScenario[];
  onOverrideChange: (overrides: Record<string, string>) => void;
  currentDecision: DecisionRecord;
  alternative: AlternativeDecision | null;
  currentStage: number;
}

export const CounterfactualPreview: React.FC<CounterfactualPreviewProps> = ({ 
  scenarios, 
  onOverrideChange,
  currentDecision,
  alternative,
  currentStage
}) => {
  const [activeToggles, setActiveToggles] = useState<Record<string, string>>({});
  const [baseDecision, setBaseDecision] = useState<DecisionRecord | null>(null);

  // Store the base decision when component mounts or when toggles are completely cleared
  useEffect(() => {
    if (Object.keys(activeToggles).length === 0) {
      setBaseDecision(currentDecision);
    }
  }, [activeToggles, currentDecision]);

  const toggleValue = (factor: string, val: string) => {
    const newToggles = { ...activeToggles };
    if (newToggles[factor] === val || val === 'Current') {
      delete newToggles[factor];
    } else {
      newToggles[factor] = val;
    }
    setActiveToggles(newToggles);
    onOverrideChange(newToggles);
  };

  const hasChanges = Object.keys(activeToggles).length > 0;
  const isVisible = currentStage >= 6; // Reveals towards the end of the trace

  const decisionChanged = baseDecision && baseDecision.recommendation !== currentDecision.recommendation;

  return (
    <div className={`bg-ink-900 border border-ink-800 rounded-2xl p-8 shadow-sm text-white transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4 pointer-events-none'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-ink-800 pb-4 gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-blood-500" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            WHAT WOULD CHANGE THE DECISION?
          </h3>
        </div>
        <div className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded bg-ink-800 text-ink-400 self-start md:self-auto">
          COUNTERFACTUAL PREVIEW
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        <div className="space-y-6">
          {scenarios.map(scenario => {
            const activeVal = activeToggles[scenario.factor] || 'Current';
            
            return (
              <div key={scenario.factor}>
                <div className="text-xs font-bold text-ink-300 mb-2">{scenario.factor}</div>
                <div className="flex p-1 bg-ink-950 rounded-lg border border-ink-800">
                  <button 
                    onClick={() => toggleValue(scenario.factor, scenario.negativeChange)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${
                      activeVal === scenario.negativeChange ? 'bg-ink-800 text-white shadow-sm' : 'text-ink-500 hover:text-ink-300'
                    }`}
                  >
                    {scenario.negativeChange}
                  </button>
                  <button 
                    onClick={() => toggleValue(scenario.factor, 'Current')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${
                      activeVal === 'Current' ? 'bg-ink-700 text-white shadow-sm' : 'text-ink-500 hover:text-ink-300'
                    }`}
                  >
                    {scenario.currentValue}
                  </button>
                  <button 
                    onClick={() => toggleValue(scenario.factor, scenario.positiveChange)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${
                      activeVal === scenario.positiveChange ? 'bg-ink-800 text-white shadow-sm' : 'text-ink-500 hover:text-ink-300'
                    }`}
                  >
                    {scenario.positiveChange}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex flex-col justify-center space-y-4">
          <div className={`bg-ink-950 border p-6 rounded-xl relative overflow-hidden transition-all duration-300 ${
            decisionChanged ? 'border-blood-500/50' : 'border-ink-800'
          }`}>
            <div className="mb-6 relative z-10">
              <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                <span>{hasChanges ? 'SIMULATED DECISION' : 'CURRENT DECISION'}</span>
                {hasChanges && <span className="px-2 py-0.5 bg-blood-900/40 text-blood-400 rounded">LIVE RECALCULATION</span>}
              </div>
              <div className={`text-lg font-bold transition-all duration-300 text-white`}>
                {currentDecision.recommendation}
              </div>
              <div className="text-xs text-ink-400 mt-1">
                Reasoning Strength: {currentDecision.strength}/100
              </div>
            </div>
            
            {hasChanges && (
              <div className={`absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${
                decisionChanged ? 'from-blood-600/30' : 'from-blood-900/30'
              } via-transparent to-transparent pointer-events-none transition-all duration-500`} />
            )}
          </div>

          {/* WHAT CHANGED PANEL */}
          {hasChanges && baseDecision && (
            <div className="bg-ink-950 border border-ink-800 p-6 rounded-xl animate-fade-in">
              <div className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-ink-400">
                <Activity className="w-3 h-3" /> WHAT CHANGED?
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex-1 text-ink-500 truncate">{baseDecision.recommendation}</div>
                  <ArrowRight className="w-4 h-4 text-ink-600 flex-shrink-0" />
                  <div className={`flex-1 truncate ${decisionChanged ? 'text-blood-400' : 'text-white'}`}>
                    {currentDecision.recommendation}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="text-[9px] font-bold text-ink-600 uppercase tracking-widest">PRIMARY CHANGE:</div>
                    <div className="text-xs text-ink-300">
                      {Object.entries(activeToggles).map(([k, v]) => `${k} shifted by ${v}`).join(', ')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[9px] font-bold text-ink-600 uppercase tracking-widest">DECISION IMPACT:</div>
                    <div className={`text-xs font-bold ${decisionChanged ? 'text-blood-400' : 'text-emerald-400'}`}>
                      {decisionChanged 
                        ? 'Recommendation changed due to altered constraints.' 
                        : 'DECISION STABLE. The recommendation remained unchanged because the primary constraints were not materially altered.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
