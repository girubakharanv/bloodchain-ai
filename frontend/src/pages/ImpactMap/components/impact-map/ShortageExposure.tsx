import React from 'react';
import { AlertTriangle, ArrowDown } from 'lucide-react';
import { ShortageExposureMetrics } from '../../types/impactMap';
import { SimulationStage } from '../../utils/impactMapSimulationController';

interface ShortageExposureProps {
  metrics: ShortageExposureMetrics;
  progress?: number;
  stage?: SimulationStage;
}

export const ShortageExposure: React.FC<ShortageExposureProps> = ({ metrics, progress = 100, stage = 'COMPLETE' }) => {
  const showDetail = stage === 'COMPLETE' || stage === 'MEASURE';
  
  // Interpolate the difference
  const currentVal = Math.round(metrics.baseline + ((metrics.optimized - metrics.baseline) * (progress / 100)));

  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-8 shadow-sm h-full flex flex-col justify-between transition-colors duration-1000">
      <div>
        <div className="flex items-center gap-2 mb-6 border-b border-ink-100 pb-4">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">
            MODELED SHORTAGE EXPOSURE
          </h3>
        </div>
        
        <div className={`text-xs text-ink-500 italic mb-8 transition-opacity duration-1000 ${showDetail ? 'opacity-100' : 'opacity-0'}`}>
          “Modeled exposure to insufficient inventory under the simulated scenario.”
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-ink-50 rounded-xl p-4 text-center border border-ink-100">
          <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-1">BASELINE</div>
          <div className="text-2xl font-bold text-ink-900">{metrics.baseline} <span className="text-sm">units</span></div>
        </div>
        
        <div className={`flex items-center justify-center transition-all duration-1000 ${showDetail ? 'text-emerald-500' : 'text-ink-200 opacity-50'}`}>
          <ArrowDown className="w-6 h-6 -rotate-90" />
        </div>
        
        <div className={`bg-white rounded-xl p-4 text-center border transition-all duration-1000 ${showDetail ? 'border-emerald-200 shadow-sm scale-105' : 'border-ink-200'}`}>
          <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${showDetail ? 'text-emerald-600' : 'text-ink-400'}`}>
            {showDetail ? 'OPTIMIZED' : 'SIMULATING'}
          </div>
          <div className="text-2xl font-bold text-ink-900">{currentVal} <span className="text-sm">units</span></div>
        </div>
      </div>
      
      <div className={`text-center text-xs font-bold uppercase tracking-widest py-2 rounded-lg transition-all duration-1000 ${
        showDetail ? 'bg-emerald-50 border border-emerald-100 text-emerald-700 opacity-100' : 'bg-transparent border border-transparent text-transparent opacity-0'
      }`}>
        CHANGE: {metrics.change} units
      </div>
    </div>
  );
};
