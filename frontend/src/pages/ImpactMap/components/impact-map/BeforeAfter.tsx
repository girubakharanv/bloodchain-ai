import React from 'react';
import { ArrowRight, Activity, ShieldCheck } from 'lucide-react';
import { BeforeAfterComparison } from '../../types/impactMap';

interface BeforeAfterProps {
  comparison: BeforeAfterComparison;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({ comparison }) => {
  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-8 shadow-sm animate-fade-in relative">
      <div className="flex items-center gap-2 mb-8 pb-4 border-b border-ink-100">
        <Activity className="w-5 h-5 text-ink-400" />
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">
          BEFORE vs AFTER BLOODCHAIN
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Divider */}
        <div className="hidden md:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 items-center justify-center pointer-events-none">
          <div className="absolute top-0 bottom-0 w-px bg-ink-100" />
          <div className="bg-white border border-ink-200 text-ink-400 p-2 rounded-full relative z-10">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Baseline */}
        <div>
          <div className="text-[10px] font-bold tracking-widest text-ink-400 uppercase mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-ink-300" />
            BASELINE NETWORK
          </div>
          
          <ul className="space-y-4">
            {[
              comparison.baseline.expiryPressure,
              comparison.baseline.allocation,
              comparison.baseline.routeSelection,
              comparison.baseline.shortageExposure,
              comparison.baseline.resilience
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ink-300 flex-shrink-0" />
                <span className="text-sm font-medium text-ink-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Optimized */}
        <div className="md:pl-4">
          <div className="text-[10px] font-bold tracking-widest text-blood-600 uppercase mb-6 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blood-500" />
            BLOODCHAIN-OPTIMIZED
          </div>
          
          <ul className="space-y-4">
            {[
              comparison.optimized.expiryPressure,
              comparison.optimized.allocation,
              comparison.optimized.routeSelection,
              comparison.optimized.shortageExposure,
              comparison.optimized.resilience
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blood-500 flex-shrink-0" />
                <span className="text-sm font-bold text-ink-900">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
