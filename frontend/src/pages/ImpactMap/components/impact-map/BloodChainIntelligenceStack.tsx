import React from 'react';
import { Database, Zap } from 'lucide-react';
import { SimulationStage } from '../../utils/impactMapSimulationController';

interface IntelligenceStackProps {
  currentStage: SimulationStage;
}

const FEATURES = [
  { id: 1, name: 'Expiry Echo Engine™', activeStages: ['PREDICT'] },
  { id: 2, name: 'Blood Network Time Machine™', activeStages: ['PREDICT', 'SIMULATE'] },
  { id: 3, name: 'BloodFlow Negotiator™', activeStages: ['DECIDE', 'ALLOCATE', 'OPTIMIZE'] },
  { id: 4, name: 'Rescue Route Composer™', activeStages: ['ROUTE', 'DECIDE', 'OPTIMIZE'] },
  { id: 5, name: 'Cold Chain Sentinel™', activeStages: ['VERIFY'] },
  { id: 6, name: 'Collection Compass™', activeStages: ['PREDICT'] },
  { id: 7, name: 'Supply Stress Simulator™', activeStages: ['SIMULATE', 'MEASURE'] },
  { id: 8, name: 'Blood Passport Ledger™', activeStages: ['VERIFY'] },
  { id: 9, name: 'Decision DNA™', activeStages: ['DECIDE', 'EXPLAIN'] },
  { id: 10, name: 'Blood Rescue Impact Map™', activeStages: ['MEASURE', 'COMPLETE'] }
];

export const BloodChainIntelligenceStack: React.FC<IntelligenceStackProps> = ({ currentStage }) => {
  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-6 shadow-sm animate-fade-in h-full">
      <div className="flex items-center gap-2 mb-6 border-b border-ink-100 pb-4">
        <Database className="w-5 h-5 text-ink-400" />
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">
          BLOODCHAIN INTELLIGENCE STACK
        </h3>
      </div>
      
      <div className="space-y-2">
        {FEATURES.map(feature => {
          const isActive = feature.activeStages.includes(currentStage) || currentStage === 'COMPLETE';
          
          return (
            <div key={feature.id} className={`flex items-center justify-between p-2 rounded transition-colors duration-300 ${isActive ? 'bg-blood-50 border border-blood-100' : 'hover:bg-ink-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`text-[10px] font-bold w-4 text-center ${isActive ? 'text-blood-600' : 'text-ink-400'}`}>
                  {feature.id.toString().padStart(2, '0')}
                </div>
                <div className={`text-xs font-bold ${isActive ? 'text-blood-900' : 'text-ink-600'}`}>
                  {feature.name}
                </div>
              </div>
              {isActive && currentStage !== 'COMPLETE' && (
                <div className="flex items-center gap-1 bg-blood-100 text-blood-700 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest animate-pulse">
                  <Zap className="w-3 h-3" /> ACTIVE
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
