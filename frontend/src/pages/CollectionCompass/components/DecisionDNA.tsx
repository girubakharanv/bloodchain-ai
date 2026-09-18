import React from 'react';
import { Cpu, TrendingUp, PackageMinus, Clock, Activity, MapPin, ArrowUp, ArrowDown, ChevronRight, Zap } from 'lucide-react';
import { CollectionPriorityScore } from '../utils/collectionCompassEngine';

interface DecisionDNAProps {
  scoreData: CollectionPriorityScore;
  originalScoreData?: CollectionPriorityScore;
  isSimulationMode: boolean;
  region: string;
  bloodGroup: string;
}

export const DecisionDNA: React.FC<DecisionDNAProps> = ({ scoreData, originalScoreData, isSimulationMode, region, bloodGroup }) => {
  const isHighRisk = scoreData.level === 'HIGH' || scoreData.level === 'CRITICAL';

  const formatDriverScore = (score: number) => {
    return score > 0 ? `+${score}` : `${score}`;
  };

  const hasShifted = isSimulationMode && originalScoreData && (originalScoreData.totalScore !== scoreData.totalScore);

  return (
    <div className={`bg-ink-900 border ${isSimulationMode ? 'border-amber-500/50' : 'border-ink-800'} rounded-2xl shadow-sm overflow-hidden h-full flex flex-col relative transition-colors duration-500`}>
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none transition-colors duration-1000 ${
        isSimulationMode ? 'bg-amber-600/10' :
        isHighRisk ? 'bg-blood-600/10' : scoreData.level === 'WATCH' ? 'bg-amber-600/10' : 'bg-emerald-600/5'
      }`} />
      
      <div className="px-6 py-4 border-b border-ink-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isSimulationMode ? (
            <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
          ) : (
            <Cpu className={`w-4 h-4 ${isHighRisk ? 'text-blood-500' : 'text-ink-400'}`} />
          )}
          <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider">
            {isSimulationMode ? 'Decision DNA Shift' : 'Decision DNA'}
          </h3>
        </div>
        {isSimulationMode && <span className="text-[9px] font-bold tracking-widest text-amber-500 uppercase">Simulated</span>}
      </div>
      
      <div className="p-6 flex-grow flex flex-col relative z-10 overflow-y-auto">
        
        {hasShifted && originalScoreData ? (
          // SIMULATION SHIFT VIEW
          <div className="mb-6 animate-fade-in">
            <h4 className="text-[10px] font-bold text-amber-400 mb-4 uppercase tracking-widest flex items-center gap-2">
              Why did the priority move?
            </h4>
            
            <div className="flex items-center justify-between bg-ink-800/50 rounded-lg p-4 border border-ink-800 mb-6">
              <div className="text-center">
                <div className="text-[9px] uppercase font-bold tracking-wider text-ink-500 mb-1">Before</div>
                <div className="text-xl font-editorial font-bold text-white">{originalScoreData.totalScore}</div>
                <div className="text-[9px] text-ink-400 uppercase">{originalScoreData.primaryDriver}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-ink-600" />
              <div className="text-center">
                <div className="text-[9px] uppercase font-bold tracking-wider text-amber-500 mb-1">After</div>
                <div className="text-xl font-editorial font-bold text-amber-400">{scoreData.totalScore}</div>
                <div className="text-[9px] text-amber-400/80 uppercase">{scoreData.primaryDriver}</div>
              </div>
            </div>
            
            <div className="space-y-4 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-300 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Demand</span>
                {scoreData.drivers.forecastDemandGrowth > originalScoreData.drivers.forecastDemandGrowth ? <ArrowUp className="w-4 h-4 text-blood-500"/> : 
                 scoreData.drivers.forecastDemandGrowth < originalScoreData.drivers.forecastDemandGrowth ? <ArrowDown className="w-4 h-4 text-emerald-500"/> : <span className="text-ink-600">-</span>}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-300 flex items-center gap-2"><PackageMinus className="w-4 h-4"/> Inventory</span>
                {scoreData.drivers.currentStockDeficit > originalScoreData.drivers.currentStockDeficit ? <ArrowUp className="w-4 h-4 text-blood-500"/> : 
                 scoreData.drivers.currentStockDeficit < originalScoreData.drivers.currentStockDeficit ? <ArrowDown className="w-4 h-4 text-emerald-500"/> : <span className="text-ink-600">-</span>}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-300 flex items-center gap-2"><Activity className="w-4 h-4"/> Capacity</span>
                {scoreData.drivers.collectionCapacity > originalScoreData.drivers.collectionCapacity ? <ArrowUp className="w-4 h-4 text-blood-500"/> : 
                 scoreData.drivers.collectionCapacity < originalScoreData.drivers.collectionCapacity ? <ArrowDown className="w-4 h-4 text-emerald-500"/> : <span className="text-ink-600">-</span>}
              </div>
            </div>
          </div>
        ) : (
          // STANDARD VIEW
          <>
            <h4 className="text-[10px] font-bold text-white mb-6 uppercase tracking-widest">
              Why is {region} a priority?
            </h4>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink-300 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>Demand Forecast</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-mono text-xs text-ink-500">{formatDriverScore(scoreData.drivers.forecastDemandGrowth)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink-300 text-sm">
                  <PackageMinus className="w-4 h-4" />
                  <span>Current Inventory</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowDown className="w-3.5 h-3.5 text-blood-500" />
                  <span className="font-mono text-xs text-ink-500">{formatDriverScore(scoreData.drivers.currentStockDeficit)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink-300 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Expiry Exposure</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-mono text-xs text-ink-500">{formatDriverScore(scoreData.drivers.expiryExposure)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink-300 text-sm">
                  <Activity className="w-4 h-4" />
                  <span>Collection Capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowDown className="w-3.5 h-3.5 text-blood-500" />
                  <span className="font-mono text-xs text-ink-500">{formatDriverScore(scoreData.drivers.collectionCapacity)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink-300 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Regional Pressure</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-mono text-xs text-ink-500">{formatDriverScore(scoreData.drivers.regionalPressure)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-auto pt-4 border-t border-ink-800">
          <p className={`text-sm italic leading-relaxed border-l-2 pl-3 ${isSimulationMode ? 'text-amber-200/80 border-amber-500/50' : 'text-ink-400 border-blood-600'}`}>
            "{scoreData.reason}"
          </p>
        </div>

      </div>
    </div>
  );
};
