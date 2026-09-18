import React from 'react';
import { Cpu, TrendingUp, Thermometer, Battery, Shield, Navigation, Clock, Activity, Map } from 'lucide-react';
import { SentinelScoreDetails } from '../utils/sentinelRiskEngine';

interface SentinelLogicProps {
  details: SentinelScoreDetails | undefined;
}

export const SentinelLogic: React.FC<SentinelLogicProps> = ({ details }) => {
  if (!details) {
    return (
      <div className="bg-ink-900 border border-ink-800 rounded-2xl shadow-sm overflow-hidden h-full flex items-center justify-center p-6">
        <span className="text-ink-400 italic text-sm">Engine calculating...</span>
      </div>
    );
  }

  const isHighRisk = details.riskLevel === 'HIGH' || details.riskLevel === 'CRITICAL';

  const getIconForComponent = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('trend')) return <TrendingUp className="w-3.5 h-3.5" />;
    if (n.includes('temperature')) return <Thermometer className="w-3.5 h-3.5" />;
    if (n.includes('battery')) return <Battery className="w-3.5 h-3.5" />;
    if (n.includes('door')) return <Shield className="w-3.5 h-3.5" />;
    if (n.includes('duration')) return <Clock className="w-3.5 h-3.5" />;
    if (n.includes('connectivity')) return <Navigation className="w-3.5 h-3.5" />;
    if (n.includes('sensor')) return <Activity className="w-3.5 h-3.5" />;
    if (n.includes('route')) return <Map className="w-3.5 h-3.5" />;
    return <Cpu className="w-3.5 h-3.5" />;
  };

  return (
    <div className="bg-ink-900 border border-ink-800 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col relative">
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none transition-colors ${
        isHighRisk ? 'bg-blood-600/10' : details.riskLevel === 'WATCH' ? 'bg-amber-600/10' : 'bg-emerald-600/5'
      }`} />
      
      <div className="px-6 py-4 border-b border-ink-800/50 flex items-center gap-2">
        <Cpu className={`w-4 h-4 ${isHighRisk ? 'text-blood-500' : 'text-ink-400'}`} />
        <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider">Why this risk score?</h3>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        
        <div className="flex items-end gap-3 mb-6 relative z-10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-500 mb-1">Sentinel Risk</span>
            <span className={`text-4xl font-editorial font-bold ${
              isHighRisk ? 'text-blood-500' : details.riskLevel === 'WATCH' ? 'text-amber-500' : 'text-white'
            }`}>
              {details.totalScore} <span className="text-lg text-ink-600 font-sans">/ 100</span>
            </span>
          </div>
          <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${
            isHighRisk ? 'bg-blood-900/50 text-blood-400 border border-blood-800' : 
            details.riskLevel === 'WATCH' ? 'bg-amber-900/50 text-amber-400 border border-amber-800' : 
            'bg-emerald-900/50 text-emerald-400 border border-emerald-800'
          }`}>
            {details.riskLevel}
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold tracking-widest text-ink-500 mb-3">Driven By:</span>
        
        <div className="space-y-3 relative z-10">
          {details.components.slice(0, 5).map((comp, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-ink-600 font-mono text-[10px]">{(idx + 1).toString().padStart(2, '0')}</span>
                <div className={`flex items-center gap-1.5 ${idx === 0 ? 'text-white font-medium' : 'text-ink-300 text-sm'}`}>
                  {getIconForComponent(comp.name)}
                  <span>{comp.name}</span>
                </div>
              </div>
              <span className={`font-mono text-xs ${idx === 0 ? 'text-blood-400 font-bold' : 'text-ink-500'}`}>
                +{Math.round(comp.weightedScore)}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
