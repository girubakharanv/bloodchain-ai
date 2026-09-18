import React from 'react';
import { AlertTriangle, MapPin, Activity, AlertOctagon } from 'lucide-react';

interface KPIBarProps {
  unitsAtRisk: number;
  rescueOpportunities: number;
  predictedUtilizationPct: number;
  criticalWithin48h: number;
}

export const KPIBar: React.FC<KPIBarProps> = ({ 
  unitsAtRisk, 
  rescueOpportunities, 
  predictedUtilizationPct, 
  criticalWithin48h 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1 */}
      <div className="bg-white border border-ink-200/40 rounded flex flex-col p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <AlertTriangle size={48} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blood-500"></div>
          <span className="text-xs font-bold text-ink-500 uppercase tracking-widest">Units at Expiry Risk</span>
        </div>
        <div className="text-4xl font-editorial font-bold text-ink-900 mb-1">{unitsAtRisk}</div>
        <div className="text-xs text-ink-500 flex items-center gap-1">
          <span className="text-blood-600 font-bold">↑ 12%</span> vs last simulated cycle
        </div>
      </div>

      {/* KPI 2 */}
      <div className="bg-white border border-ink-200/40 rounded flex flex-col p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <MapPin size={48} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span className="text-xs font-bold text-ink-500 uppercase tracking-widest">Rescue Opportunities</span>
        </div>
        <div className="text-4xl font-editorial font-bold text-ink-900 mb-1">{rescueOpportunities}</div>
        <div className="text-xs text-ink-500 flex items-center gap-1">
          <span className="text-green-600 font-bold">4 new</span> network routes detected
        </div>
      </div>

      {/* KPI 3 */}
      <div className="bg-white border border-ink-200/40 rounded flex flex-col p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <Activity size={48} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          <span className="text-xs font-bold text-ink-500 uppercase tracking-widest">Predicted Utilization</span>
        </div>
        <div className="text-4xl font-editorial font-bold text-ink-900 mb-1">{predictedUtilizationPct}%</div>
        <div className="text-xs text-ink-500 flex items-center gap-1">
          System-wide forecast (7 days)
        </div>
      </div>

      {/* KPI 4 */}
      <div className="bg-white border border-ink-200/40 rounded flex flex-col p-4 shadow-sm relative overflow-hidden border-t-2 border-t-blood-600">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <AlertOctagon size={48} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blood-700 animate-pulse"></div>
          <span className="text-xs font-bold text-ink-500 uppercase tracking-widest">Critical within 48H</span>
        </div>
        <div className="text-4xl font-editorial font-bold text-blood-700 mb-1">{criticalWithin48h}</div>
        <div className="text-xs text-ink-500 flex items-center gap-1">
          Requires immediate review
        </div>
      </div>
    </div>
  );
};
