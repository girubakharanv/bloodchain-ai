import React from 'react';
import { Activity, ShieldAlert, AlertTriangle, Cpu } from 'lucide-react';

interface ColdChainKPIsProps {
  activeCount: number;
  atRiskCount: number;
  highestScore: number;
  topDriver: string;
}

export const ColdChainKPIs: React.FC<ColdChainKPIsProps> = ({ activeCount, atRiskCount, highestScore, topDriver }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white border border-ink-200/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Active Shipments</span>
          <div className="w-8 h-8 rounded-full bg-ink-50 flex items-center justify-center">
            <Activity className="w-4 h-4 text-ink-600" />
          </div>
        </div>
        <div className="text-3xl font-editorial font-bold text-ink-900">
          {activeCount.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="bg-white border border-ink-200/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        {atRiskCount > 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-all"></div>}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">At-Risk Shipments</span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${atRiskCount > 0 ? 'bg-amber-100' : 'bg-ink-50'}`}>
            <ShieldAlert className={`w-4 h-4 ${atRiskCount > 0 ? 'text-amber-600' : 'text-ink-400'}`} />
          </div>
        </div>
        <div className={`text-3xl font-editorial font-bold relative z-10 ${atRiskCount > 0 ? 'text-amber-600' : 'text-ink-900'}`}>
          {atRiskCount.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="bg-white border border-ink-200/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        {highestScore >= 50 && <div className="absolute top-0 right-0 w-16 h-16 bg-blood-50 rounded-bl-full -mr-4 -mt-4 transition-all"></div>}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Highest Risk Score</span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${highestScore >= 50 ? 'bg-blood-100' : 'bg-ink-50'}`}>
            <AlertTriangle className={`w-4 h-4 ${highestScore >= 50 ? 'text-blood-600' : 'text-ink-400'}`} />
          </div>
        </div>
        <div className="flex items-end gap-1 relative z-10">
          <div className={`text-3xl font-editorial font-bold ${highestScore >= 75 ? 'text-blood-700' : highestScore >= 50 ? 'text-amber-600' : 'text-ink-900'}`}>
            {highestScore > -1 ? highestScore : '--'}
          </div>
          {highestScore > -1 && <div className="text-sm text-ink-400 mb-1 font-sans">/ 100</div>}
        </div>
      </div>

      <div className="bg-ink-900 text-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-300">Top Network Driver</span>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="text-sm font-bold text-white relative z-10 uppercase tracking-wide mt-2 line-clamp-2">
          {topDriver || '--'}
        </div>
      </div>
    </div>
  );
};
