import React, { useState } from 'react';
import { calculateSummaryMetrics, demoBloodUnits } from '../../data/bloodUnits';
import type { BloodUnit } from '../../data/bloodUnits';
import { KPIBar } from './components/KPIBar';
import { ExpiryEchoVisual } from './components/ExpiryEchoVisual';
import { UnitIntelligenceTable } from './components/UnitIntelligenceTable';
import { EchoUnitPanel } from './components/EchoUnitPanel';
import { ScenarioSimulator } from './components/ScenarioSimulator';

export const ExpiryIntelligence: React.FC = () => {
  const [demandModifier, setDemandModifier] = useState<number>(0);
  const [isLiveSimulation, setIsLiveSimulation] = useState<boolean>(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [simulationTick, setSimulationTick] = useState<number>(0);

  // Live simulation effect
  React.useEffect(() => {
    let interval: number;
    if (isLiveSimulation) {
      interval = window.setInterval(() => {
        setSimulationTick(prev => prev + 1);
      }, 3000); // simulate 1 hour passing every 3 seconds for demo purposes
    }
    return () => clearInterval(interval);
  }, [isLiveSimulation]);

  // Filters state
  const [filterGroup, setFilterGroup] = useState<string>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  // Derive metrics with live simulation time decay applied to units
  const liveUnits = demoBloodUnits.map(unit => ({
    ...unit,
    hoursRemaining: Math.max(0, unit.hoursRemaining - simulationTick)
  }));
  const metrics = calculateSummaryMetrics(liveUnits, demandModifier);

  // Apply filters
  const filteredUnits = metrics.simulatedUnits
    .filter(u => filterGroup === 'ALL' || u.bloodGroup === filterGroup)
    .filter(u => {
      if (filterRisk === 'ALL') return true;
      if (filterRisk === 'LOW') return u.simulatedRisk < 50;
      if (filterRisk === 'MEDIUM') return u.simulatedRisk >= 50 && u.simulatedRisk < 80;
      if (filterRisk === 'HIGH') return u.simulatedRisk >= 80;
      return true;
    })
    .sort((a, b) => b.simulatedRisk - a.simulatedRisk);

  return (
    <div className="flex h-full w-full bg-paper">
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${selectedUnitId ? 'mr-96' : ''}`}>
        
        {/* Header */}
        <div className="px-8 py-10 border-b border-ink-200/40">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-blood-800/10 text-blood-800 text-[10px] font-bold tracking-widest uppercase rounded">01 / Expiry Echo Engine™</span>
              </div>
              <h1 className="font-editorial text-4xl font-bold text-ink-900 leading-tight mb-2">See the future<br />of every unit.</h1>
              <p className="text-ink-600 max-w-lg">Identify blood units whose remaining shelf life may not align with predicted demand.</p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
               <div className="flex items-center gap-3">
                 <span className="text-xs font-bold text-ink-500 uppercase tracking-widest">Live Simulation</span>
                 <button 
                   onClick={() => setIsLiveSimulation(!isLiveSimulation)}
                   className={`w-12 h-6 rounded-full transition-colors relative ${isLiveSimulation ? 'bg-blood-600' : 'bg-ink-300'}`}
                 >
                   <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isLiveSimulation ? 'translate-x-6' : ''}`} />
                 </button>
               </div>
               {isLiveSimulation && (
                 <div className="text-[10px] font-bold text-blood-600 tracking-wider flex items-center gap-1">
                   <div className="w-1.5 h-1.5 bg-blood-600 rounded-full animate-pulse" />
                   Simulation clock running
                 </div>
               )}
               <p className="text-[10px] text-ink-400 mt-2">Demo intelligence • simulated network</p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 overflow-y-auto space-y-8">
          
          {/* KPI Bar */}
          <KPIBar 
             unitsAtRisk={metrics.unitsAtRisk}
             rescueOpportunities={metrics.rescueOpportunities}
             predictedUtilizationPct={metrics.predictedUtilizationPct}
             criticalWithin48h={metrics.criticalWithin48h}
          />

          {/* Filters Bar */}
          <div className="flex gap-4">
             <select 
               className="bg-white border border-ink-200/40 rounded-md px-4 py-2 text-sm font-medium text-ink-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blood-500"
               value={filterGroup}
               onChange={(e) => setFilterGroup(e.target.value)}
             >
               <option value="ALL">All Blood Groups</option>
               {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
             </select>
             <select 
               className="bg-white border border-ink-200/40 rounded-md px-4 py-2 text-sm font-medium text-ink-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blood-500"
               value={filterRisk}
               onChange={(e) => setFilterRisk(e.target.value)}
             >
               <option value="ALL">All Risk Levels</option>
               <option value="HIGH">High Risk (&gt;80)</option>
               <option value="MEDIUM">Medium Risk (50-80)</option>
               <option value="LOW">Low Risk (&lt;50)</option>
             </select>
          </div>

          <div className="flex gap-8">
            {/* Main Visual Column */}
            <div className="flex-1 space-y-8">
               {/* Echo Visual */}
               <ExpiryEchoVisual 
                  units={filteredUnits}
                  selectedUnitId={selectedUnitId}
                  onSelectUnit={setSelectedUnitId}
               />
               
               {/* Unit Table */}
               <UnitIntelligenceTable 
                  units={filteredUnits}
                  selectedUnitId={selectedUnitId}
                  onSelectUnit={setSelectedUnitId}
               />
            </div>

            {/* Sidebar Column */}
            <div className="w-80 space-y-8 shrink-0">
               {/* Scenario Simulator */}
               <ScenarioSimulator 
                  demandModifier={demandModifier}
                  setDemandModifier={setDemandModifier}
               />
            </div>
          </div>

        </div>
      </div>

      {/* Slide-out Echo Panel */}
      {selectedUnitId && (
        <div className="fixed top-20 bottom-0 right-0 w-96 bg-white border-l border-ink-200/40 shadow-2xl z-40 transform transition-transform duration-300 translate-x-0">
           <EchoUnitPanel 
             unitId={selectedUnitId}
             units={metrics.simulatedUnits}
             onClose={() => setSelectedUnitId(null)}
           />
        </div>
      )}

    </div>
  );
};
