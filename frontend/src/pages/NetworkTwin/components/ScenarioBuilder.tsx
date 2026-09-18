import React from 'react';
import type { SimulationScenario, Facility } from '../simulationData';
import { Sliders, AlertTriangle, Zap } from 'lucide-react';

interface ScenarioBuilderProps {
  scenario: SimulationScenario;
  onChange: (key: keyof SimulationScenario, value: any) => void;
  facilities: Facility[];
}

export const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({ scenario, onChange, facilities }) => {
  const applyPreset = (preset: 'normal' | 'surge' | 'disruption') => {
    if (preset === 'normal') {
      onChange('demandMultiplier', 0);
      onChange('transportDelayMinutes', 0);
      onChange('offlineFacilities', []);
      onChange('emergencyMode', false);
    } else if (preset === 'surge') {
      onChange('demandMultiplier', 40);
      onChange('transportDelayMinutes', 0);
      onChange('offlineFacilities', []);
      onChange('emergencyMode', false);
    } else if (preset === 'disruption') {
      onChange('demandMultiplier', 20);
      onChange('transportDelayMinutes', 60);
      onChange('offlineFacilities', ['bb-a']);
      onChange('emergencyMode', false);
    }
  };

  const handleBreakNetwork = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'bank_offline') {
      onChange('offlineFacilities', [...scenario.offlineFacilities, 'bb-a']);
    } else if (val === 'delay_transport') {
      onChange('transportDelayMinutes', 120);
    } else if (val === 'increase_demand') {
      onChange('demandMultiplier', 60);
    } else if (val === 'emergency') {
      onChange('demandMultiplier', 40);
      onChange('transportDelayMinutes', 30);
      onChange('offlineFacilities', ['bb-b']);
      onChange('emergencyMode', true);
    }
    e.target.value = '';
  };

  return (
    <div className="bg-white border border-ink-200/40 rounded shadow-sm flex flex-col h-full">
      <div className="p-4 border-b border-ink-200/40 bg-paper/50 flex justify-between items-center">
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest flex items-center gap-2">
          <Sliders size={16} /> Change the Future
        </h3>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        
        {/* Presets */}
        <div>
          <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-2">Scenario Presets</div>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => applyPreset('normal')}
              className="p-2 border border-ink-200 rounded text-center hover:bg-ink-50 transition-colors"
            >
              <div className="text-xs font-bold text-ink-900">Normal</div>
            </button>
            <button 
              onClick={() => applyPreset('surge')}
              className="p-2 border border-orange-200 bg-orange-50 rounded text-center hover:bg-orange-100 transition-colors"
            >
              <div className="text-xs font-bold text-orange-900">Surge</div>
            </button>
            <button 
              onClick={() => applyPreset('disruption')}
              className="p-2 border border-blood-200 bg-blood-50 rounded text-center hover:bg-blood-100 transition-colors"
            >
              <div className="text-xs font-bold text-blood-900">Major</div>
            </button>
          </div>
        </div>

        <hr className="border-ink-100" />

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-ink-700">Demand Surge</span>
              <span className="font-mono text-ink-500">{scenario.demandMultiplier > 0 ? '+' : ''}{scenario.demandMultiplier}%</span>
            </div>
            <input 
              type="range" min="-20" max="60" step="10" 
              value={scenario.demandMultiplier}
              onChange={(e) => onChange('demandMultiplier', parseInt(e.target.value))}
              className="w-full h-1 bg-ink-200 rounded-lg appearance-none cursor-pointer accent-blood-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-ink-700">Transport Delay</span>
              <span className="font-mono text-ink-500">{scenario.transportDelayMinutes > 0 ? '+' : ''}{scenario.transportDelayMinutes} MIN</span>
            </div>
            <input 
              type="range" min="0" max="120" step="15" 
              value={scenario.transportDelayMinutes}
              onChange={(e) => onChange('transportDelayMinutes', parseInt(e.target.value))}
              className="w-full h-1 bg-ink-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
          </div>

          <div>
            <div className="text-xs font-bold text-ink-700 mb-2">Facility Availability</div>
            <div className="space-y-2">
               {facilities.map(fac => (
                 <label key={fac.id} className="flex items-center gap-2 text-sm text-ink-600 cursor-pointer">
                   <input 
                     type="checkbox" 
                     className="rounded border-ink-300 text-blood-600 focus:ring-blood-600"
                     checked={!scenario.offlineFacilities.includes(fac.id)}
                     onChange={(e) => {
                       if (e.target.checked) {
                         onChange('offlineFacilities', scenario.offlineFacilities.filter(id => id !== fac.id));
                       } else {
                         onChange('offlineFacilities', [...scenario.offlineFacilities, fac.id]);
                       }
                     }}
                   />
                   {fac.name} Online
                 </label>
               ))}
            </div>
          </div>
        </div>

        <hr className="border-ink-100" />

        {/* Break Network */}
        <div className="bg-ink-900 rounded-md p-4">
           <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest mb-2">
             <Zap size={14} className="text-orange-400" /> Break the Network
           </div>
           <p className="text-[10px] text-ink-400 mb-3 leading-relaxed">
             Simulation-only interaction to demonstrate cascade failures.
           </p>
           <select 
             className="w-full bg-ink-800 border border-ink-700 text-white text-xs p-2 rounded outline-none focus:border-blood-500"
             onChange={handleBreakNetwork}
             value=""
           >
             <option value="" disabled>Choose a disruption...</option>
             <option value="bank_offline">Remove Blood Bank Alpha</option>
             <option value="delay_transport">Delay transport (120 min)</option>
             <option value="increase_demand">Increase demand (+60%)</option>
             <option value="emergency">EMERGENCY MODE</option>
           </select>
        </div>

      </div>
    </div>
  );
};
