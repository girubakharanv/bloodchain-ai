import React from 'react';
import { Compass, MapPin, Clock, Droplets, Target, AlertTriangle, Zap, ArrowRight } from 'lucide-react';
import { CollectionPriorityScore } from '../utils/collectionCompassEngine';

interface CollectionCompassCardProps {
  region: string;
  horizonLabel: string;
  bloodGroup: string;
  scoreData: CollectionPriorityScore;
  originalScoreData?: CollectionPriorityScore;
  isSimulationMode: boolean;
}

export const CollectionCompassCard: React.FC<CollectionCompassCardProps> = ({ 
  region, 
  horizonLabel, 
  bloodGroup, 
  scoreData,
  originalScoreData,
  isSimulationMode
}) => {
  
  const isHighRisk = scoreData.level === 'HIGH' || scoreData.level === 'CRITICAL';
  
  const hasShifted = isSimulationMode && originalScoreData && (originalScoreData.totalScore !== scoreData.totalScore);

  return (
    <div className={`bg-ink-900 border ${isSimulationMode ? 'border-amber-500/50' : 'border-ink-800'} rounded-2xl shadow-lg p-6 relative overflow-hidden group transition-colors duration-500 h-full flex flex-col`}>
      {/* Decorative compass rings */}
      <div className="absolute top-0 right-0 w-64 h-64 border-[1px] border-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none transition-transform duration-1000 group-hover:scale-110" />
      <div className="absolute top-0 right-0 w-48 h-48 border-[1px] border-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none transition-transform duration-700 group-hover:scale-105" />
      
      {/* Glow based on priority */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none transition-colors duration-1000 ${
        isSimulationMode ? 'bg-amber-500/10' :
        isHighRisk ? 'bg-blood-600/20' : scoreData.level === 'WATCH' ? 'bg-amber-500/10' : 'bg-emerald-500/10'
      }`} />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-2">
          {isSimulationMode ? (
            <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
          ) : (
            <Compass className={`w-5 h-5 ${isHighRisk ? 'text-blood-500' : 'text-ink-400'}`} />
          )}
          <h2 className="text-sm font-bold text-white tracking-widest uppercase">
            {isSimulationMode ? 'Simulated Compass' : 'Collection Compass'}
          </h2>
        </div>
      </div>

      <div className="space-y-6 relative z-10 flex-grow">
        
        {hasShifted && originalScoreData ? (
          // BEFORE / AFTER SPLIT VIEW
          <div className="grid grid-cols-2 gap-4 h-full animate-fade-in">
            {/* BEFORE */}
            <div className="bg-ink-800/50 rounded-lg p-4 border border-ink-800 flex flex-col justify-between relative">
              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-ink-900 border border-ink-700 flex items-center justify-center">
                <ArrowRight className="w-3 h-3 text-ink-400" />
              </div>
              
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-ink-500 mb-2">Before</div>
                <div className="text-2xl font-editorial font-bold text-ink-400 mb-2">{region}</div>
                <div className="text-xs font-bold text-ink-500 mb-1">{horizonLabel}</div>
                <div className="text-xs font-bold text-ink-500">{bloodGroup}</div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-ink-800/50">
                <div className="text-[9px] uppercase font-bold tracking-widest text-ink-600 mb-1">Priority</div>
                <div className="text-xl font-editorial font-bold text-ink-400">{originalScoreData.totalScore} <span className="text-[10px] font-sans">/ 100</span></div>
                <div className="text-[9px] font-bold text-ink-500 uppercase tracking-wider">{originalScoreData.level}</div>
              </div>
            </div>
            
            {/* AFTER */}
            <div className="bg-amber-900/10 rounded-lg p-4 border border-amber-900/50 flex flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-amber-500 mb-2">After</div>
                <div className="text-2xl font-editorial font-bold text-white mb-2">{region}</div>
                <div className="text-xs font-bold text-ink-200 mb-1">{horizonLabel}</div>
                <div className="text-xs font-bold text-blood-400">{bloodGroup}</div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-amber-900/30">
                <div className="text-[9px] uppercase font-bold tracking-widest text-amber-600 mb-1">Priority</div>
                <div className="text-xl font-editorial font-bold text-amber-400">{scoreData.totalScore} <span className="text-[10px] font-sans">/ 100</span></div>
                <div className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">
                  {scoreData.level === 'CRITICAL' || scoreData.level === 'HIGH' ? <AlertTriangle className="w-2.5 h-2.5 inline mr-1" /> : null}
                  {scoreData.level}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // STANDARD VIEW
          <div className="flex flex-col h-full">
            <div>
              <span className="flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest text-ink-500 mb-1">
                <MapPin className="w-3 h-3" /> Where
              </span>
              <span className="text-2xl font-editorial font-bold text-white">{region}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <span className="flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest text-ink-500 mb-1">
                  <Clock className="w-3 h-3" /> When
                </span>
                <span className="text-sm font-bold text-ink-200">{horizonLabel}</span>
              </div>
              <div>
                <span className="flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest text-ink-500 mb-1">
                  <Droplets className="w-3 h-3" /> What
                </span>
                <span className="text-sm font-bold text-blood-400">{bloodGroup}</span>
              </div>
            </div>

            <div className="mt-6 flex-grow">
              <span className="flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest text-ink-500 mb-1">
                <Target className="w-3 h-3" /> Recommendation
              </span>
              <p className={`text-sm leading-relaxed border-l-2 pl-3 ${isSimulationMode ? 'text-amber-100 italic border-amber-500/50' : 'text-ink-300 border-ink-700'}`}>
                {scoreData.recommendation}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-ink-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-ink-500">Priority Score</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  isSimulationMode ? 'bg-amber-900/80 text-amber-400 border border-amber-800' :
                  isHighRisk ? 'bg-blood-900/80 text-blood-400 border border-blood-800' : 
                  scoreData.level === 'WATCH' ? 'bg-amber-900/80 text-amber-400 border border-amber-800' :
                  'bg-emerald-900/80 text-emerald-400 border border-emerald-800'
                }`}>
                  {isHighRisk && <AlertTriangle className="w-3 h-3 inline mr-1 mb-0.5" />}
                  {scoreData.level}
                </span>
                <span className={`text-2xl font-editorial font-bold ${isSimulationMode ? 'text-amber-500' : isHighRisk ? 'text-blood-500' : 'text-white'}`}>
                  {scoreData.totalScore} <span className="text-sm font-sans text-ink-600">/ 100</span>
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
