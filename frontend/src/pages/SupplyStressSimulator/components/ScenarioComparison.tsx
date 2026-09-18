import React from 'react';
import { EngineResult } from '../utils/supplyStressEngine';
import { ArrowRight, Activity } from 'lucide-react';

interface ScenarioComparisonProps {
  baseline: EngineResult;
  active: EngineResult;
  isStressed: boolean;
}

export const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({ baseline, active, isStressed }) => {
  return (
    <div className={`bg-ink-900 border ${isStressed ? 'border-amber-500/50' : 'border-ink-800'} rounded-2xl shadow-sm overflow-hidden h-full flex flex-col relative transition-colors duration-500`}>
      <div className="px-6 py-4 border-b border-ink-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-ink-400" />
          <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider">
            Scenario Comparison
          </h3>
        </div>
        {isStressed && <span className="text-[9px] font-bold tracking-widest text-amber-500 uppercase">Simulated</span>}
      </div>
      
      <div className="p-6 flex-grow flex flex-col relative z-10 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-ink-800 text-[9px] uppercase font-bold tracking-widest text-ink-500">
              <th className="py-3 font-bold w-1/3">Metric</th>
              <th className="py-3 font-bold text-center">Baseline</th>
              <th className="py-3 text-center"></th>
              <th className={`py-3 font-bold text-center ${isStressed ? 'text-amber-500' : 'text-ink-500'}`}>Stress</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {/* Resilience */}
            <tr className="border-b border-ink-800/50">
              <td className="py-4 whitespace-nowrap text-ink-300 font-bold">Resilience</td>
              <td className="py-4 whitespace-nowrap text-center text-ink-400 font-editorial text-lg">{baseline.networkResilience}</td>
              <td className="py-4 text-center"><ArrowRight className="w-4 h-4 text-ink-600 inline-block" /></td>
              <td className={`py-4 whitespace-nowrap text-center font-editorial text-lg font-bold ${isStressed ? 'text-amber-500' : 'text-ink-400'}`}>
                {active.networkResilience}
              </td>
            </tr>
            {/* Shortage Exposure */}
            <tr className="border-b border-ink-800/50">
              <td className="py-4 whitespace-nowrap text-ink-300 font-bold">Shortage Exposure</td>
              <td className="py-4 whitespace-nowrap text-center text-ink-400 font-editorial text-lg">{baseline.shortageExposure}%</td>
              <td className="py-4 text-center"><ArrowRight className="w-4 h-4 text-ink-600 inline-block" /></td>
              <td className={`py-4 whitespace-nowrap text-center font-editorial text-lg font-bold ${isStressed ? 'text-blood-500' : 'text-ink-400'}`}>
                {active.shortageExposure}%
              </td>
            </tr>
            {/* Stressed Facilities */}
            <tr className="border-b border-ink-800/50">
              <td className="py-4 whitespace-nowrap text-ink-300 font-bold">Stressed Facilities</td>
              <td className="py-4 whitespace-nowrap text-center text-ink-400 font-editorial text-lg">{baseline.stressedFacilities}</td>
              <td className="py-4 text-center"><ArrowRight className="w-4 h-4 text-ink-600 inline-block" /></td>
              <td className={`py-4 whitespace-nowrap text-center font-editorial text-lg font-bold ${isStressed ? (active.stressedFacilities > baseline.stressedFacilities ? 'text-blood-500' : 'text-amber-500') : 'text-ink-400'}`}>
                {active.stressedFacilities}
              </td>
            </tr>
            {/* Bottlenecks */}
            <tr>
              <td className="py-4 whitespace-nowrap text-ink-300 font-bold">Bottlenecks</td>
              <td className="py-4 whitespace-nowrap text-center text-ink-400 font-editorial text-lg">{baseline.bottlenecks.length}</td>
              <td className="py-4 text-center"><ArrowRight className="w-4 h-4 text-ink-600 inline-block" /></td>
              <td className={`py-4 whitespace-nowrap text-center font-editorial text-lg font-bold ${isStressed ? (active.bottlenecks.length > baseline.bottlenecks.length ? 'text-blood-500' : 'text-amber-500') : 'text-ink-400'}`}>
                {active.bottlenecks.length}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
