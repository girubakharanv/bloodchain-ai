import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { DecisionDriver } from '../types/decisionDna';

interface DriverRankingProps {
  drivers: DecisionDriver[];
  currentStage: number;
  selectedDriver: string | null;
  onDriverClick: (driverId: string | null) => void;
}

export const DriverRanking: React.FC<DriverRankingProps> = ({ 
  drivers, 
  currentStage,
  selectedDriver,
  onDriverClick
}) => {
  const isVisible = currentStage >= 2;

  const topDrivers = drivers.slice(0, 5);

  return (
    <div className={`bg-white border border-ink-200 rounded-2xl p-8 shadow-sm h-full transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4 pointer-events-none'
    }`}>
      <div className="mb-6">
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-widest mb-1">
          DECISION DRIVERS
        </h3>
        <div className="text-sm text-ink-500 italic">
          Ranked by logistics impact
        </div>
      </div>
      
      <div className="space-y-4">
        {topDrivers.map((driver) => {
          const isSelected = selectedDriver === driver.id;
          
          return (
            <div key={driver.id} className="flex flex-col gap-2">
              <button 
                onClick={() => onDriverClick(isSelected ? null : driver.id)}
                className={`flex items-center gap-4 group text-left w-full rounded-lg p-2 transition-colors ${
                  isSelected ? 'bg-ink-50 ring-1 ring-ink-200' : 'hover:bg-ink-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors ${
                  driver.direction === 'UP' ? 'bg-emerald-50 text-emerald-700' :
                  driver.direction === 'DOWN' ? 'bg-amber-50 text-amber-700' :
                  'bg-ink-100 text-ink-600'
                }`}>
                  0{driver.rank}
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-bold text-ink-900 truncate pr-2 group-hover:text-blood-600 transition-colors">
                      {driver.name}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {driver.direction === 'UP' && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                      {driver.direction === 'DOWN' && <ArrowDownRight className="w-3 h-3 text-amber-500" />}
                      {driver.direction === 'NEUTRAL' && <Minus className="w-3 h-3 text-ink-400" />}
                    </div>
                  </div>
                  
                  {/* Impact Bar */}
                  <div className="w-full bg-ink-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        driver.impactLevel === 'HIGH' ? 'bg-blood-600' :
                        driver.impactLevel === 'MEDIUM' ? 'bg-blood-400' :
                        'bg-ink-300'
                      }`} 
                      style={{ width: `${driver.impactScore}%` }}
                    />
                  </div>
                </div>
              </button>
              
              {/* Expandable Explanation Panel */}
              {isSelected && (
                <div className="ml-12 p-3 bg-ink-900 rounded-lg text-white animate-fade-in shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blood-500/20 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-[9px] font-bold text-ink-500 uppercase tracking-widest mb-1">Impact</div>
                      <div className="text-xs font-bold">{driver.impactLevel} ({driver.impactScore}/100)</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-ink-500 uppercase tracking-widest mb-1">Effect</div>
                      <div className={`text-xs font-bold ${
                        driver.direction === 'UP' ? 'text-emerald-400' : 
                        driver.direction === 'DOWN' ? 'text-amber-400' : 
                        'text-ink-400'
                      }`}>
                        {driver.direction === 'UP' ? 'INCREASES PRIORITY' : 
                         driver.direction === 'DOWN' ? 'OPPOSES DECISION' : 
                         'NEUTRAL'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[9px] font-bold text-ink-500 uppercase tracking-widest mb-1">Why</div>
                    <div className="text-sm italic text-ink-200 border-l-2 border-blood-500 pl-2">
                      "{driver.description}"
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
