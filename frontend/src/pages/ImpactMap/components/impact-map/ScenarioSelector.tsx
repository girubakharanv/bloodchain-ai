import React from 'react';
import { Settings2 } from 'lucide-react';
import { ImpactScenario } from '../../types/impactMap';

interface ScenarioSelectorProps {
  selectedScenario: ImpactScenario;
  onScenarioChange: (scenario: ImpactScenario) => void;
}

const SCENARIOS: { id: ImpactScenario; label: string }[] = [
  { id: 'NORMAL_NETWORK', label: 'NORMAL NETWORK' },
  { id: 'DEMAND_SURGE', label: 'DEMAND SURGE' },
  { id: 'SUPPLY_SHOCK', label: 'SUPPLY SHOCK' },
  { id: 'TRANSPORT_DISRUPTION', label: 'TRANSPORT DISRUPTION' },
  { id: 'FACILITY_OUTAGE', label: 'FACILITY OUTAGE' },
  { id: 'EXPIRY_WAVE', label: 'EXPIRY WAVE' }
];

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ selectedScenario, onScenarioChange }) => {
  return (
    <div className="bg-white border border-ink-200 rounded-xl p-4 shadow-sm animate-fade-in flex flex-col md:flex-row items-center gap-6">
      <div className="flex items-center gap-2 text-[10px] font-bold text-ink-500 uppercase tracking-widest">
        <Settings2 className="w-4 h-4 text-blood-600" />
        SCENARIO
      </div>
      
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map(scenario => (
          <button
            key={scenario.id}
            onClick={() => onScenarioChange(scenario.id)}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-colors ${
              selectedScenario === scenario.id
                ? 'bg-ink-900 text-white shadow-sm'
                : 'bg-ink-50 text-ink-500 hover:bg-ink-100 hover:text-ink-700'
            }`}
          >
            {scenario.label}
          </button>
        ))}
      </div>
    </div>
  );
};
