import React from 'react';
import { Map, Zap } from 'lucide-react';
import { RegionalImpact } from '../../types/impactMap';
import { SimulationStage } from '../../utils/impactMapSimulationController';

interface NetworkImpactMapProps {
  regions: RegionalImpact[];
  progress?: number;
  stage?: SimulationStage;
}

export const NetworkImpactMap: React.FC<NetworkImpactMapProps> = ({ regions, progress = 100, stage = 'COMPLETE' }) => {
  // If baseline, show stress. If complete, show clear.
  const isOptimizing = progress > 0 && progress < 100;
  
  return (
    <div className="bg-ink-950 border border-ink-900 rounded-2xl p-8 shadow-xl flex flex-col h-[600px] relative overflow-hidden transition-all duration-1000">
      {/* Background intensity based on stress vs optimized */}
      <div className="absolute inset-0 bg-blood-900/10 transition-opacity duration-1000" style={{ opacity: progress < 50 ? 1 : 0 }} />
      <div className="absolute inset-0 bg-emerald-900/5 transition-opacity duration-1000" style={{ opacity: progress >= 50 ? 1 : 0 }} />

      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-ink-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            NETWORK IMPACT MAP
          </h3>
        </div>
        <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest flex items-center gap-2">
          {isOptimizing && <div className="w-2 h-2 rounded-full bg-blood-500 animate-pulse" />}
          {progress === 100 ? 'OPTIMIZED STATE' : progress === 0 ? 'BASELINE STATE' : 'ANALYSIS IN PROGRESS'}
        </div>
      </div>
      
      <div className="flex-grow relative border border-ink-800 rounded-xl overflow-hidden bg-ink-900">
        <div className="absolute inset-0 opacity-20" 
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        
        <svg className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-1000">
          {regions.map((source, i) => (
            regions.map((target, j) => {
              if (i < j) {
                // If baseline, show chaotic/red lines. If optimized, show clean/emerald paths
                const isChaotic = progress < 40;
                return (
                  <line 
                    key={`line-${i}-${j}`}
                    x1={`${source.coordinates.x}%`} 
                    y1={`${source.coordinates.y}%`}
                    x2={`${target.coordinates.x}%`} 
                    y2={`${target.coordinates.y}%`}
                    stroke={isChaotic ? "rgba(220, 38, 38, 0.2)" : (progress > 80 && (i===0||j===0) ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.05)")}
                    strokeWidth={isChaotic ? "2" : "1"}
                    strokeDasharray={isChaotic ? "4 4" : "0"}
                    className={isChaotic ? 'animate-pulse' : ''}
                    style={{ transition: 'all 1s ease' }}
                  />
                );
              }
              return null;
            })
          ))}
          
          {/* Active optimization route if routing stage */}
          {stage === 'OPTIMIZE' && (
             <line 
             x1={`${regions[0]?.coordinates.x}%`} 
             y1={`${regions[0]?.coordinates.y}%`}
             x2={`${regions[1]?.coordinates.x}%`} 
             y2={`${regions[1]?.coordinates.y}%`}
             stroke="rgba(59, 130, 246, 0.6)"
             strokeWidth="3"
             strokeDasharray="8 8"
             className="animate-pulse"
           />
          )}
        </svg>

        {regions.map((region, idx) => (
          <div 
            key={idx}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-1000"
            style={{ left: `${region.coordinates.x}%`, top: `${region.coordinates.y}%` }}
          >
            {/* Stress indicator pulsing */}
            {progress < 50 && region.baselineRisk === 'High' && (
              <div className="absolute inset-0 bg-blood-500/30 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '2s' }} />
            )}
            {/* Optimization indicator pulsing */}
            {progress >= 80 && region.optimizedRisk === 'Low' && (
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
            )}
            
            <div className={`w-4 h-4 rounded-full relative z-10 transition-colors duration-1000 ${
              progress < 50 ? 'bg-ink-800 border-2 border-blood-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 
              'bg-ink-800 border-2 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
            }`} />
            
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-ink-950 border border-ink-800 rounded px-3 py-2 z-20 min-w-max shadow-lg opacity-80 group-hover:opacity-100 transition-opacity">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-1 text-center">
                {region.region}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono text-center flex items-center gap-1 justify-center">
                <Zap className="w-3 h-3" /> {progress < 50 ? region.baselineRisk : region.optimizedRisk} Risk
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
