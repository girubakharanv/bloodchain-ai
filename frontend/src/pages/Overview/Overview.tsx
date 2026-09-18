import React from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateSummaryMetrics, demoBloodUnits } from '../../data/bloodUnits';
import { AlertTriangle, MapPin, Activity, AlertOctagon } from 'lucide-react';

export const Overview: React.FC = () => {
  const navigate = useNavigate();
  const metrics = calculateSummaryMetrics(demoBloodUnits);

  return (
    <div className="flex h-full w-full bg-paper flex-col">
      <div className="px-8 py-10 border-b border-ink-200/40">
        <h1 className="font-editorial text-4xl font-bold text-ink-900 mb-2">Network Overview</h1>
        <p className="text-ink-600">Simulated intelligence control center.</p>
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        <h2 className="text-sm font-bold text-ink-900 uppercase tracking-widest mb-4">Critical Intelligence Signals</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Expiry Risk KPI (Clickable) */}
          <div 
            onClick={() => navigate('/expiry-intelligence')}
            className="bg-white border border-blood-200 hover:border-blood-400 rounded flex flex-col p-4 shadow-sm relative overflow-hidden cursor-pointer transition-all group hover:shadow-md"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <AlertTriangle size={48} className="text-blood-700" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blood-500 animate-pulse"></div>
              <span className="text-xs font-bold text-blood-700 uppercase tracking-widest group-hover:text-blood-900 transition-colors">Expiry Risk</span>
            </div>
            {/* Dynamically calculated instead of hardcoded 184 */}
            <div className="text-4xl font-editorial font-bold text-ink-900 mb-1 group-hover:text-blood-800 transition-colors">
              {metrics.unitsAtRisk}
            </div>
            <div className="text-xs text-ink-500 flex items-center gap-1">
              <span className="text-blood-600 font-bold">Review required</span> Click to analyze
            </div>
          </div>

          {/* Rescue Opportunities KPI */}
          <div className="bg-white border border-ink-200/40 rounded flex flex-col p-4 shadow-sm relative overflow-hidden opacity-80 cursor-not-allowed">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <MapPin size={48} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-xs font-bold text-ink-500 uppercase tracking-widest">Rescue Opportunities</span>
            </div>
            <div className="text-4xl font-editorial font-bold text-ink-900 mb-1">{metrics.rescueOpportunities}</div>
            <div className="text-xs text-ink-500">Network module locked</div>
          </div>

          {/* Predicted Utilization KPI */}
          <div className="bg-white border border-ink-200/40 rounded flex flex-col p-4 shadow-sm relative overflow-hidden opacity-80 cursor-not-allowed">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Activity size={48} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span className="text-xs font-bold text-ink-500 uppercase tracking-widest">Predicted Utilization</span>
            </div>
            <div className="text-4xl font-editorial font-bold text-ink-900 mb-1">{metrics.predictedUtilizationPct}%</div>
            <div className="text-xs text-ink-500">Forecast module locked</div>
          </div>

          {/* Critical within 48H KPI */}
          <div 
            onClick={() => navigate('/expiry-intelligence')}
            className="bg-white border border-ink-200/40 hover:border-blood-200 rounded flex flex-col p-4 shadow-sm relative overflow-hidden cursor-pointer transition-all group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <AlertOctagon size={48} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blood-700"></div>
              <span className="text-xs font-bold text-ink-500 uppercase tracking-widest">Critical within 48H</span>
            </div>
            <div className="text-4xl font-editorial font-bold text-blood-700 mb-1">{metrics.criticalWithin48h}</div>
            <div className="text-xs text-ink-500">Click to filter in Expiry Engine</div>
          </div>
        </div>

      </div>
    </div>
  );
};
