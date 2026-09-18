import React from 'react';
import { Shield, TrendingUp } from 'lucide-react';
import { ResilienceScoreMetrics } from '../../types/impactMap';
import { SimulationStage } from '../../utils/impactMapSimulationController';

interface ResilienceScoreProps {
  metrics: ResilienceScoreMetrics;
  progress?: number;
  stage?: SimulationStage;
}

export const ResilienceScore: React.FC<ResilienceScoreProps> = ({ metrics, progress = 100, stage = 'COMPLETE' }) => {
  const showDetail = stage === 'COMPLETE' || stage === 'MEASURE';
  
  const currentVal = Math.round(metrics.baseline + ((metrics.optimized - metrics.baseline) * (progress / 100)));

  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-8 shadow-sm h-full flex flex-col justify-between items-center text-center">
      <div className="w-full flex items-center justify-between mb-4 border-b border-ink-100 pb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">
            NETWORK RESILIENCE
          </h3>
        </div>
      </div>
      
      <div className={`text-xs text-ink-500 italic mb-6 w-full text-left transition-opacity duration-1000 ${showDetail ? 'opacity-100' : 'opacity-0'}`}>
        “Modeled resilience under the selected network scenario.”
      </div>
      
      {/* Gauge Visualization */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" className="stroke-ink-100" strokeWidth="8" />
          
          <circle 
            cx="50" cy="50" r="45" 
            fill="none" 
            className="stroke-ink-300 opacity-50 transition-all duration-1000" 
            strokeWidth="8" 
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * metrics.baseline) / 100}
            strokeLinecap="round"
          />
          
          <circle 
            cx="50" cy="50" r="45" 
            fill="none" 
            className="stroke-emerald-500 transition-all duration-[500ms] ease-out" 
            strokeWidth="8" 
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * currentVal) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-editorial font-bold text-ink-900 leading-none">{currentVal}</span>
          <span className={`text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1 mt-1 transition-opacity duration-1000 ${showDetail ? 'opacity-100' : 'opacity-0'}`}>
            <TrendingUp className="w-3 h-3" /> +{metrics.change}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-widest border-t border-ink-100 pt-4">
        <div className="text-ink-400">BASELINE: {metrics.baseline}</div>
        <div className={`transition-opacity duration-1000 ${showDetail ? 'text-emerald-600 opacity-100' : 'text-emerald-600 opacity-0'}`}>
          OPTIMIZED: {metrics.optimized}
        </div>
      </div>
    </div>
  );
};
