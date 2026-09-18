import React from 'react';
import { Activity, Thermometer, ShieldAlert, Clock, TrendingUp } from 'lucide-react';

interface CollectionKPIsProps {
  totalForecast: number;
  totalGap: number;
  highPriorityRegions: number;
  planningHorizon: string;
}

export const CollectionKPIs: React.FC<CollectionKPIsProps> = ({ totalForecast, totalGap, highPriorityRegions, planningHorizon }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      <div className="bg-white border border-ink-200/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Forecast Demand</span>
          <div className="w-8 h-8 rounded-full bg-ink-50 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-ink-600" />
          </div>
        </div>
        <div className="flex items-end gap-1">
          <div className="text-3xl font-editorial font-bold text-ink-900">
            {totalForecast.toLocaleString()}
          </div>
          <div className="text-sm text-ink-400 mb-1 font-sans">units</div>
        </div>
      </div>

      <div className="bg-white border border-ink-200/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        {totalGap < 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-blood-50 rounded-bl-full -mr-4 -mt-4"></div>}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Collection Gap</span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${totalGap < 0 ? 'bg-blood-100' : 'bg-emerald-50'}`}>
            <Activity className={`w-4 h-4 ${totalGap < 0 ? 'text-blood-600' : 'text-emerald-600'}`} />
          </div>
        </div>
        <div className="flex items-end gap-1 relative z-10">
          <div className={`text-3xl font-editorial font-bold ${totalGap < 0 ? 'text-blood-700' : 'text-emerald-600'}`}>
            {totalGap > 0 ? '+' : ''}{totalGap.toLocaleString()}
          </div>
          <div className="text-sm text-ink-400 mb-1 font-sans">units</div>
        </div>
      </div>

      <div className="bg-white border border-ink-200/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        {highPriorityRegions > 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -mr-4 -mt-4"></div>}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">High-Priority Regions</span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${highPriorityRegions > 0 ? 'bg-amber-100' : 'bg-ink-50'}`}>
            <ShieldAlert className={`w-4 h-4 ${highPriorityRegions > 0 ? 'text-amber-600' : 'text-ink-400'}`} />
          </div>
        </div>
        <div className={`text-3xl font-editorial font-bold relative z-10 ${highPriorityRegions > 0 ? 'text-amber-600' : 'text-ink-900'}`}>
          {highPriorityRegions.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="bg-ink-900 text-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-300">Planning Horizon</span>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="text-3xl font-editorial font-bold text-white relative z-10 uppercase tracking-wide">
          {planningHorizon}
        </div>
      </div>

    </div>
  );
};
