import React from 'react';
import { SlidersHorizontal, Zap } from 'lucide-react';
import { StressModifiers } from '../utils/supplyStressEngine';

interface StressControlsProps {
  modifiers: StressModifiers;
  setModifiers: React.Dispatch<React.SetStateAction<StressModifiers>>;
}

export const StressControls: React.FC<StressControlsProps> = ({ modifiers, setModifiers }) => {

  const updateModifier = (key: keyof StressModifiers, value: number) => {
    setModifiers(prev => ({ ...prev, [key]: value }));
  };

  const handlePreset = (preset: string) => {
    switch (preset) {
      case 'NORMAL':
        setModifiers({ demand: 0, supply: 0, collection: 0, transportDelay: 0, facilityOutage: 0, expiryPressure: 0 });
        break;
      case 'DEMAND SURGE':
        setModifiers({ demand: 40, supply: 0, collection: 0, transportDelay: 0, facilityOutage: 0, expiryPressure: 0 });
        break;
      case 'SUPPLY SHOCK':
        setModifiers({ demand: 0, supply: -30, collection: 0, transportDelay: 0, facilityOutage: 0, expiryPressure: 0 });
        break;
      case 'TRANSPORT DISRUPTION':
        setModifiers({ demand: 0, supply: 0, collection: 0, transportDelay: 90, facilityOutage: 0, expiryPressure: 0 });
        break;
      case 'FACILITY OUTAGE':
        setModifiers({ demand: 0, supply: 0, collection: 0, transportDelay: 0, facilityOutage: 1, expiryPressure: 0 });
        break;
      case 'EXPIRY WAVE':
        setModifiers({ demand: 0, supply: 0, collection: 0, transportDelay: 0, facilityOutage: 0, expiryPressure: 30 });
        break;
      case 'TOTAL STRESS':
        setModifiers({ demand: 40, supply: -20, collection: -30, transportDelay: 60, facilityOutage: 1, expiryPressure: 15 });
        break;
    }
  };

  return (
    <div className="bg-white border border-ink-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-ink-100 bg-ink-50/50 flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-ink-500" />
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">
          Stress Factors
        </h3>
      </div>
      
      <div className="p-6 flex-grow flex flex-col gap-6 overflow-y-auto">
        
        {/* Sliders */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-ink-500">Demand Surge</span>
              <span className="font-editorial font-bold text-lg text-ink-900">{modifiers.demand > 0 ? '+' : ''}{modifiers.demand}%</span>
            </div>
            <input type="range" min={0} max={100} step={10} value={modifiers.demand} onChange={(e) => updateModifier('demand', parseInt(e.target.value))} className="w-full accent-blood-600 h-1.5 bg-ink-200 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-ink-500">Supply Reduction</span>
              <span className="font-editorial font-bold text-lg text-ink-900">{modifiers.supply}%</span>
            </div>
            <input type="range" min={-80} max={0} step={10} value={modifiers.supply} onChange={(e) => updateModifier('supply', parseInt(e.target.value))} className="w-full accent-amber-500 h-1.5 bg-ink-200 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-ink-500">Collection Disruption</span>
              <span className="font-editorial font-bold text-lg text-ink-900">{modifiers.collection}%</span>
            </div>
            <input type="range" min={-80} max={0} step={10} value={modifiers.collection} onChange={(e) => updateModifier('collection', parseInt(e.target.value))} className="w-full accent-amber-500 h-1.5 bg-ink-200 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-ink-500">Transport Delay</span>
              <span className="font-editorial font-bold text-lg text-ink-900">+{modifiers.transportDelay} min</span>
            </div>
            <input type="range" min={0} max={180} step={15} value={modifiers.transportDelay} onChange={(e) => updateModifier('transportDelay', parseInt(e.target.value))} className="w-full accent-blood-600 h-1.5 bg-ink-200 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-ink-500">Facility Outage</span>
              <span className="font-editorial font-bold text-lg text-ink-900">{modifiers.facilityOutage}</span>
            </div>
            <input type="range" min={0} max={3} step={1} value={modifiers.facilityOutage} onChange={(e) => updateModifier('facilityOutage', parseInt(e.target.value))} className="w-full accent-blood-600 h-1.5 bg-ink-200 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-ink-500">Expiry Pressure</span>
              <span className="font-editorial font-bold text-lg text-ink-900">+{modifiers.expiryPressure}%</span>
            </div>
            <input type="range" min={0} max={80} step={10} value={modifiers.expiryPressure} onChange={(e) => updateModifier('expiryPressure', parseInt(e.target.value))} className="w-full accent-amber-500 h-1.5 bg-ink-200 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>

        {/* Presets */}
        <div className="mt-6 pt-6 border-t border-ink-100">
          <h4 className="text-[9px] uppercase font-bold tracking-widest text-ink-400 mb-3 flex items-center gap-1.5">
            <Zap className="w-3 h-3" /> Preset Scenarios
          </h4>
          <div className="flex flex-wrap gap-2">
            {['NORMAL', 'DEMAND SURGE', 'SUPPLY SHOCK', 'TRANSPORT DISRUPTION', 'FACILITY OUTAGE', 'EXPIRY WAVE', 'TOTAL STRESS'].map(preset => (
              <button
                key={preset}
                onClick={() => handlePreset(preset)}
                className={`px-3 py-1.5 border rounded text-[9px] font-bold uppercase tracking-widest transition-colors ${preset === 'TOTAL STRESS' ? 'bg-ink-900 text-white border-ink-900 hover:bg-ink-800' : 'bg-white text-ink-600 border-ink-200 hover:border-blood-400 hover:text-blood-600'}`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};
