import React from 'react';
import { Activity, ShieldAlert, Building2, GitMerge } from 'lucide-react';

interface StressKPIsProps {
  resilience: number;
  shortageExposure: number;
  facilitiesStressed: number;
  bottleneckCount: number;
}

export const StressKPIs: React.FC<StressKPIsProps> = ({ 
  resilience, 
  shortageExposure, 
  facilitiesStressed, 
  bottleneckCount 
}) => {
  
  const getResilienceColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-emerald-400';
    if (score >= 40) return 'text-amber-500';
    if (score >= 20) return 'text-blood-400';
    return 'text-blood-600';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      
      {/* Resilience */}
      <div className="bg-white border border-ink-200 rounded-xl p-4 shadow-sm flex flex-col justify-between h-[120px] relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-ink-50 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex items-center gap-1.5 text-ink-500 text-[10px] font-bold uppercase tracking-widest z-10">
          <Activity className="w-3.5 h-3.5" />
          Network Resilience
        </div>
        <div className="z-10 mt-auto">
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-editorial font-bold leading-none ${getResilienceColor(resilience)} transition-colors duration-500`}>
              {resilience}
            </span>
            <span className="text-sm font-bold text-ink-400 mb-1">/ 100</span>
          </div>
        </div>
      </div>

      {/* Shortage Exposure */}
      <div className="bg-white border border-ink-200 rounded-xl p-4 shadow-sm flex flex-col justify-between h-[120px] relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-ink-50 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex items-center gap-1.5 text-ink-500 text-[10px] font-bold uppercase tracking-widest z-10">
          <ShieldAlert className="w-3.5 h-3.5" />
          Shortage Exposure
        </div>
        <div className="z-10 mt-auto">
          <div className="flex items-end gap-1">
            <span className={`text-4xl font-editorial font-bold leading-none transition-colors duration-500 ${shortageExposure > 10 ? 'text-blood-600' : shortageExposure > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {shortageExposure}
            </span>
            <span className="text-xl font-bold text-ink-400 mb-0.5">%</span>
          </div>
        </div>
      </div>

      {/* Facilities Stressed */}
      <div className="bg-white border border-ink-200 rounded-xl p-4 shadow-sm flex flex-col justify-between h-[120px] relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-ink-50 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex items-center gap-1.5 text-ink-500 text-[10px] font-bold uppercase tracking-widest z-10">
          <Building2 className="w-3.5 h-3.5" />
          Facilities Stressed
        </div>
        <div className="z-10 mt-auto">
          <div className="flex items-end gap-1">
            <span className={`text-4xl font-editorial font-bold leading-none transition-colors duration-500 ${facilitiesStressed > 3 ? 'text-blood-600' : facilitiesStressed > 0 ? 'text-amber-500' : 'text-ink-900'}`}>
              {facilitiesStressed.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottlenecks */}
      <div className="bg-white border border-ink-200 rounded-xl p-4 shadow-sm flex flex-col justify-between h-[120px] relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-ink-50 to-transparent rounded-bl-full pointer-events-none" />
        <div className="flex items-center gap-1.5 text-ink-500 text-[10px] font-bold uppercase tracking-widest z-10">
          <GitMerge className="w-3.5 h-3.5" />
          Bottlenecks
        </div>
        <div className="z-10 mt-auto">
          <div className="flex items-end gap-1">
            <span className={`text-4xl font-editorial font-bold leading-none transition-colors duration-500 ${bottleneckCount > 1 ? 'text-blood-600' : bottleneckCount > 0 ? 'text-amber-500' : 'text-ink-900'}`}>
              {bottleneckCount.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
