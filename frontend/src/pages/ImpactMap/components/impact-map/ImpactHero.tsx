import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Activity } from 'lucide-react';
import { KPIImpact } from '../../types/impactMap';

interface ImpactHeroProps {
  kpis: KPIImpact[];
  progress?: number;
}

export const ImpactHero: React.FC<ImpactHeroProps> = ({ kpis, progress = 100 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-fade-in">
      {kpis.map((kpi, idx) => {
        // Deterministic interpolation logic
        // We know the final value is in kpi.value (e.g. "+34%" or "-12%").
        // We can parse the number out and interpolate based on progress.
        const numMatch = kpi.value.match(/([+-]?\d+)/);
        let displayValue = kpi.value;
        
        if (numMatch && progress < 100) {
          const target = parseInt(numMatch[1], 10);
          const current = Math.round(target * (progress / 100));
          displayValue = kpi.value.replace(numMatch[1], current.toString());
          if (current > 0 && !displayValue.startsWith('+') && kpi.value.startsWith('+')) {
            displayValue = '+' + displayValue;
          }
        }

        return (
          <div key={idx} className="bg-white border border-ink-200 rounded-xl p-4 shadow-sm hover:border-blood-200 transition-colors flex flex-col justify-between">
            <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-4">
              {kpi.label}
            </div>
            
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold font-editorial text-ink-900">
                {displayValue}
              </div>
              
              <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                kpi.isPositive 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'bg-amber-50 text-amber-600'
              }`}>
                {kpi.trend === 'UP' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
