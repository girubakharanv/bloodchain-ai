import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface ScenarioSimulatorProps {
  demandModifier: number;
  setDemandModifier: (value: number) => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ demandModifier, setDemandModifier }) => {
  const options = [-20, -10, 0, 10, 20, 40];

  return (
    <div className="bg-white border border-ink-200/40 rounded p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal size={18} className="text-ink-400" />
        <h3 className="font-bold text-ink-900 uppercase tracking-widest text-xs">Network Scenario Simulation</h3>
      </div>
      
      <p className="text-sm text-ink-600 mb-6">
        What if demand changes? Adjust the predicted network demand to simulate expiry risks.
      </p>

      <div className="mb-8 relative">
        <input 
          type="range" 
          min="-20" 
          max="40" 
          step="10" 
          value={demandModifier}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            // Snap to valid options
            const closest = options.reduce((prev, curr) => 
              Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
            );
            setDemandModifier(closest);
          }}
          className="w-full h-1 bg-ink-200 rounded-lg appearance-none cursor-pointer accent-blood-600"
        />
        <div className="flex justify-between mt-2 text-[10px] font-bold text-ink-400">
          <span>-20%</span>
          <span>-10%</span>
          <span>0%</span>
          <span>+10%</span>
          <span>+20%</span>
          <span>+40%</span>
        </div>
      </div>
      
      <div className="bg-paper p-4 rounded text-sm text-ink-600 border border-ink-100">
         <span className="font-bold text-ink-900 block mb-1">Scenario Active: {demandModifier > 0 ? '+' : ''}{demandModifier}% Demand</span>
         {demandModifier === 0 && 'Displaying baseline AI forecast based on current trends.'}
         {demandModifier > 0 && 'Simulating an unexpected spike in demand. Fewer units reach expiry as utilization increases.'}
         {demandModifier < 0 && 'Simulating reduced demand. Expiry risk increases as local surplus grows.'}
      </div>
    </div>
  );
};
