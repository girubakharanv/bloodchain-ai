import React from 'react';
import { SlidersHorizontal, Activity, RefreshCw, Zap, Pause, Play, Target } from 'lucide-react';

interface CollectionScenarioProps {
  isSimulationMode: boolean;
  setIsSimulationMode: (val: boolean) => void;
  
  currentCapacity: number;
  modifier: number;
  onModifierChange: (val: number) => void;
  
  demandModifier: number;
  onDemandModifierChange: (val: number) => void;

  inventoryModifier: number;
  onInventoryModifierChange: (val: number) => void;

  demoStage: number;
  onPlayDemo: () => void;
  onReset: () => void;
  onStressNetwork: () => void;
  onDemandSurge: () => void;
  onCapacityDrop: () => void;
}

export const CollectionScenario: React.FC<CollectionScenarioProps> = ({ 
  isSimulationMode,
  setIsSimulationMode,
  currentCapacity, 
  modifier, 
  onModifierChange,
  demandModifier,
  onDemandModifierChange,
  inventoryModifier,
  onInventoryModifierChange,
  demoStage,
  onPlayDemo,
  onReset,
  onStressNetwork,
  onDemandSurge,
  onCapacityDrop
}) => {

  const totalCapacity = currentCapacity + modifier;

  const demoSteps = [
    { label: "BASELINE", active: demoStage === 0 },
    { label: "DEMAND SURGE", active: demoStage === 1 },
    { label: "INVENTORY DROP", active: demoStage === 2 },
    { label: "CAPACITY DISRUPTION", active: demoStage === 3 },
    { label: "PRIORITY REASSESSMENT", active: demoStage === 4 }
  ];

  return (
    <div className={`border rounded-2xl shadow-sm overflow-hidden h-full flex flex-col transition-colors duration-500 ${isSimulationMode ? 'bg-amber-50/30 border-amber-200' : 'bg-white border-ink-200/50'}`}>
      
      {/* Header */}
      <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors ${isSimulationMode ? 'bg-amber-100/50 border-amber-200' : 'bg-ink-50/50 border-ink-100'}`}>
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-ink-500" />
          Scenario Simulation
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className={`text-[9px] font-bold uppercase tracking-widest ${isSimulationMode ? 'text-amber-600' : 'text-ink-400'}`}>
            Simulation Mode {isSimulationMode ? 'ON' : 'OFF'}
          </span>
          <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${isSimulationMode ? 'bg-amber-500' : 'bg-ink-200'}`}>
            <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isSimulationMode ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <input type="checkbox" className="hidden" checked={isSimulationMode} onChange={(e) => setIsSimulationMode(e.target.checked)} />
        </label>
      </div>
      
      <div className="p-6 flex-grow flex flex-col space-y-6 relative">
        
        {/* Overlay if not in simulation mode */}
        {!isSimulationMode && (
          <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
            <button 
              onClick={() => setIsSimulationMode(true)}
              className="bg-ink-900 text-white px-4 py-2 rounded shadow-lg text-xs font-bold uppercase tracking-wider hover:bg-ink-800 transition-colors flex items-center gap-2"
            >
              <Zap className="w-3 h-3 text-amber-400" /> Enable Simulation
            </button>
          </div>
        )}

        {/* Action Presets */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onDemandSurge} className="px-3 py-2 border border-ink-200 rounded bg-white text-[10px] font-bold uppercase tracking-wider text-ink-600 hover:border-amber-400 hover:text-amber-600 transition-colors text-left">
            Simulate Demand Surge
          </button>
          <button onClick={onCapacityDrop} className="px-3 py-2 border border-ink-200 rounded bg-white text-[10px] font-bold uppercase tracking-wider text-ink-600 hover:border-blood-400 hover:text-blood-600 transition-colors text-left">
            Simulate Disruption
          </button>
          <button onClick={onStressNetwork} className="px-3 py-2 border border-ink-900 rounded bg-ink-900 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-ink-800 transition-colors flex items-center gap-1.5 col-span-2 justify-center">
            <Activity className="w-3 h-3 text-amber-400" /> Stress Collection Network
          </button>
        </div>

        {/* Demo Script Controller */}
        <div className="flex gap-2 border-t border-b border-ink-100 py-4">
          <button onClick={onPlayDemo} className="flex-1 bg-blood-600 text-white px-3 py-2 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-blood-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
            <Play className="w-3 h-3" /> Play Demo
          </button>
          <button onClick={onReset} className="px-3 py-2 border border-ink-200 rounded bg-white text-[10px] font-bold uppercase tracking-wider text-ink-600 hover:bg-ink-50 transition-colors flex items-center justify-center gap-1.5">
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-5">
          {/* Demand Slider */}
          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-ink-500">Demand Change</span>
              <span className="font-editorial font-bold text-lg text-ink-900">{demandModifier > 0 ? '+' : ''}{demandModifier}%</span>
            </div>
            <input type="range" min={-20} max={40} step={10} value={demandModifier} onChange={(e) => onDemandModifierChange(parseInt(e.target.value))} className="w-full accent-amber-500 h-1.5 bg-ink-200 rounded-lg appearance-none cursor-pointer" />
          </div>

          {/* Inventory Slider */}
          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-ink-500">Inventory</span>
              <span className="font-editorial font-bold text-lg text-ink-900">{inventoryModifier > 0 ? '+' : ''}{inventoryModifier}%</span>
            </div>
            <input type="range" min={-20} max={20} step={10} value={inventoryModifier} onChange={(e) => onInventoryModifierChange(parseInt(e.target.value))} className="w-full accent-blood-500 h-1.5 bg-ink-200 rounded-lg appearance-none cursor-pointer" />
          </div>

          {/* Collection Capacity Slider */}
          <div>
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-ink-500">Target Capacity</span>
              <span className="font-editorial font-bold text-lg text-ink-900">{totalCapacity} <span className="text-xs font-sans text-ink-500 font-normal">u/day</span></span>
            </div>
            <input type="range" min={-Math.floor(currentCapacity * 0.5)} max={currentCapacity} step={10} value={modifier} onChange={(e) => onModifierChange(parseInt(e.target.value))} className="w-full accent-emerald-500 h-1.5 bg-ink-200 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>

        {/* Timeline */}
        {demoStage > 0 && (
          <div className="mt-auto pt-4 border-t border-ink-100">
            <h4 className="text-[9px] uppercase font-bold tracking-widest text-ink-400 mb-3">Scenario Timeline</h4>
            <div className="space-y-2">
              {demoSteps.map((step, idx) => (
                <div key={idx} className={`flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase transition-opacity duration-300 ${step.active ? 'text-ink-900 opacity-100' : (idx < demoStage ? 'text-ink-400 opacity-50' : 'text-ink-300 opacity-30')}`}>
                  <div className={`w-2 h-2 rounded-full ${step.active ? 'bg-amber-500 animate-pulse' : (idx < demoStage ? 'bg-ink-300' : 'border border-ink-300')}`} />
                  {step.label}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
