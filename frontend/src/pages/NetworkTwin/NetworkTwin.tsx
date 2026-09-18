import React, { useState, useEffect } from 'react';
import { DigitalTwinMap } from './components/DigitalTwinMap';
import { TimeController } from './components/TimeController';
import { ScenarioBuilder } from './components/ScenarioBuilder';
import { SimulationInsight } from './components/SimulationInsight';
import { ImpactComparison } from './components/ImpactComparison';
import { defaultScenario, baselineFacilities } from './simulationData';
import type { SimulationScenario } from './simulationData';
import { simulateFutureNetwork } from './simulationEngine';
import { Activity } from 'lucide-react';

export const NetworkTwin: React.FC = () => {
  const [mode, setMode] = useState<'current' | 'simulated'>('current');
  const [scenario, setScenario] = useState<SimulationScenario>(defaultScenario);
  const [timeOffsetHours, setTimeOffsetHours] = useState<number>(0);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // When in 'current' mode, time offset is technically 0 and scenario is default
  const activeTimeOffset = mode === 'current' ? 0 : timeOffsetHours;
  const activeScenario = mode === 'current' ? defaultScenario : scenario;

  const simulatedResult = simulateFutureNetwork(activeTimeOffset, activeScenario);
  const currentResult = simulateFutureNetwork(0, defaultScenario); // Baseline for comparison

  // Playback effect
  useEffect(() => {
    let interval: number;
    if (isPlaying && mode === 'simulated') {
      interval = window.setInterval(() => {
        setTimeOffsetHours(prev => {
          if (prev >= 168) {
            setIsPlaying(false);
            return 168;
          }
          return prev + 1;
        });
      }, 500 / playbackSpeed); // 1 hour = 500ms at 1x speed
    }
    return () => clearInterval(interval);
  }, [isPlaying, mode, playbackSpeed]);

  const handleScenarioChange = (key: keyof SimulationScenario, value: any) => {
    setScenario(prev => ({ ...prev, [key]: value }));
    if (mode === 'current') setMode('simulated');
  };

  const resetSimulation = () => {
    setScenario(defaultScenario);
    setTimeOffsetHours(0);
    setIsPlaying(false);
    setMode('current');
  };

  return (
    <div className="flex h-full w-full bg-paper">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-8 border-b border-ink-200/40 shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-blood-800/10 text-blood-800 text-[10px] font-bold tracking-widest uppercase rounded">02 / Blood Network Time Machine™</span>
              </div>
              <h1 className="font-editorial text-4xl font-bold text-ink-900 leading-tight mb-2">What if<br />tomorrow changes?</h1>
              <p className="text-ink-600">Simulate disruptions before they become emergencies.</p>
            </div>
            
            <div className="flex flex-col items-end gap-3">
               <div className="flex items-center gap-2">
                 <div className="text-xs font-bold text-ink-500 uppercase tracking-widest text-right">
                   Digital Twin<br/>
                   <span className="text-blood-600">● Simulation Ready</span>
                 </div>
               </div>
               
               {mode === 'current' ? (
                 <button 
                   onClick={() => setMode('simulated')}
                   className="primary-btn px-6 py-2 text-sm"
                 >
                   Enter Simulation
                 </button>
               ) : (
                 <div className="flex items-center gap-2">
                   <div className="px-4 py-2 bg-blood-50 border border-blood-200 text-blood-800 text-xs font-bold rounded flex items-center gap-2">
                     <Activity size={14} className="animate-pulse" />
                     Simulation Mode Active
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          <div className="flex gap-8">
            {/* Left Column: Digital Twin & Controls */}
            <div className="flex-1 flex flex-col gap-6">
               <div className="h-[450px]">
                 <DigitalTwinMap 
                   facilities={simulatedResult.facilities}
                   links={simulatedResult.links}
                 />
               </div>
               
               <TimeController 
                 timeOffsetHours={activeTimeOffset}
                 setTimeOffsetHours={(val) => {
                   setTimeOffsetHours(val);
                   if (mode === 'current') setMode('simulated');
                 }}
                 isPlaying={isPlaying}
                 setIsPlaying={(val) => {
                   setIsPlaying(val);
                   if (val && mode === 'current') setMode('simulated');
                 }}
                 playbackSpeed={playbackSpeed}
                 setPlaybackSpeed={setPlaybackSpeed}
                 onReset={resetSimulation}
               />

               {mode === 'simulated' && (
                 <ImpactComparison 
                   currentResult={currentResult}
                   simulatedResult={simulatedResult}
                 />
               )}
            </div>

            {/* Right Column: Scenario & Insights */}
            <div className="w-[360px] shrink-0 flex flex-col gap-6">
               <div className="flex-1 max-h-[500px]">
                 <ScenarioBuilder 
                   scenario={activeScenario}
                   onChange={handleScenarioChange}
                   facilities={baselineFacilities}
                 />
               </div>
               
               {mode === 'simulated' && (
                 <div className="h-[400px]">
                   <SimulationInsight insight={simulatedResult.insight} />
                 </div>
               )}
            </div>
          </div>

          {/* Footer Area */}
          <div className="text-center py-12">
            <h2 className="text-3xl font-editorial font-bold text-ink-900 mb-2">Stress the network<br/>before reality does.</h2>
            <p className="text-sm text-ink-600 mb-4">BloodChain AI lets decision-makers explore future disruptions before they become real-world emergencies.</p>
            <div className="text-[10px] font-bold text-blood-600 tracking-[0.2em]">PREDICT • SIMULATE • PREPARE</div>
          </div>

        </div>
      </div>
    </div>
  );
};
