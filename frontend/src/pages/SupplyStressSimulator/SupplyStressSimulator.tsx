import React, { useMemo } from 'react';
import { runStressSimulation } from './utils/supplyStressEngine';
import { useStressScenarioRunner } from './utils/stressScenarioRunner';
import { StressKPIs } from './components/StressKPIs';
import { NetworkTopology } from './components/NetworkTopology';
import { FacilityStressTable } from './components/FacilityStressTable';
import { BloodGroupStress } from './components/BloodGroupStress';
import { BottleneckPanel } from './components/BottleneckPanel';
import { WeakLinkPanel } from './components/WeakLinkPanel';
import { DecisionDNA } from './components/DecisionDNA';
import { StressTimeline } from './components/StressTimeline';
import { LiveEventStream } from './components/LiveEventStream';
import { NetworkIntelligence } from './components/NetworkIntelligence';
import { ShieldAlert, Play, Square, RefreshCcw, Pause, RotateCcw } from 'lucide-react';

export const SupplyStressSimulator: React.FC = () => {
  const runner = useStressScenarioRunner();
  
  // Base configuration to calculate baseline
  const INITIAL_MODIFIERS = {
    demand: 0,
    supply: 0,
    collection: 0,
    transportDelay: 0,
    facilityOutage: 0,
    expiryPressure: 0
  };

  const baselineResult = useMemo(() => runStressSimulation(INITIAL_MODIFIERS), []);
  const activeResult = useMemo(() => runStressSimulation(runner.modifiers), [runner.modifiers]);

  const isStressed = runner.state === 'PLAYING' || runner.state === 'FINISHED' || runner.state === 'PAUSED';
  const showFinalIntelligence = runner.state === 'FINISHED' && runner.activeScenario === 'COMBINED';

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="mb-8">
          <div className="text-[10px] font-bold tracking-[0.2em] text-blood-700 mb-4 uppercase flex justify-between items-center">
            <span>NETWORK RESILIENCE INTELLIGENCE</span>
            {runner.state !== 'IDLE' && (
              <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[9px] animate-pulse">
                SIMULATION MODE: {runner.state}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-editorial font-bold text-ink-900 mb-2">
            Supply Stress Simulator™
          </h1>
          <p className="text-ink-600 text-sm max-w-xl italic border-l-2 border-blood-600 pl-4">
            "Break the network before reality does."
          </p>
        </header>

        {/* Hero Control Panel */}
        <div className={`bg-ink-900 border ${isStressed ? 'border-blood-600/50' : 'border-ink-800'} rounded-2xl shadow-lg p-6 flex flex-col lg:flex-row items-center justify-between gap-6 transition-colors duration-700`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className={`w-5 h-5 ${isStressed ? 'text-blood-500' : 'text-ink-400'}`} />
              <h2 className="text-xl font-bold text-white tracking-widest uppercase">
                LIVE STRESS TEST
              </h2>
            </div>
            <span className="text-ink-400 text-xs italic">
              Apply a controlled disruption and watch stress propagate.
            </span>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            {runner.state === 'IDLE' ? (
              <>
                <button 
                  onClick={() => runner.startScenario('COMBINED')}
                  className="px-8 py-3 bg-blood-600 rounded text-xs font-bold uppercase tracking-wider text-white hover:bg-blood-700 transition-colors shadow-lg shadow-blood-900/50 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  BREAK THE NETWORK
                </button>
                <button 
                  onClick={() => runner.startScenario('COMBINED')}
                  className="px-6 py-3 border border-ink-700 rounded text-xs font-bold uppercase tracking-wider text-ink-300 hover:bg-ink-800 transition-colors"
                >
                  JURY DEMO
                </button>
              </>
            ) : (
              <>
                {runner.state === 'PLAYING' && (
                  <button onClick={runner.pause} className="px-6 py-3 bg-amber-600 rounded text-xs font-bold uppercase tracking-wider text-white hover:bg-amber-700 transition-colors flex items-center gap-2">
                    <Pause className="w-4 h-4" /> PAUSE
                  </button>
                )}
                {runner.state === 'PAUSED' && (
                  <button onClick={runner.resume} className="px-6 py-3 bg-emerald-600 rounded text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <Play className="w-4 h-4" /> RESUME
                  </button>
                )}
                <button onClick={runner.reset} className="px-6 py-3 border border-ink-700 rounded text-xs font-bold uppercase tracking-wider text-ink-300 hover:bg-ink-800 transition-colors flex items-center gap-2">
                  <Square className="w-4 h-4" /> RESET
                </button>
                {runner.state === 'FINISHED' && (
                  <button onClick={runner.replay} className="px-6 py-3 bg-ink-800 rounded text-xs font-bold uppercase tracking-wider text-white hover:bg-ink-700 transition-colors flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4" /> REPLAY
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Isolated Scenario Buttons */}
        {runner.state === 'IDLE' && (
           <div className="flex flex-wrap gap-2 pt-2">
             <span className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mr-2 flex items-center">ISOLATED TESTS:</span>
             <button onClick={() => runner.startScenario('DEMAND_ONLY')} className="px-3 py-1.5 border border-ink-200 rounded text-[9px] font-bold uppercase text-ink-600 hover:border-blood-400 hover:text-blood-600">TEST DEMAND</button>
             <button onClick={() => runner.startScenario('SUPPLY_ONLY')} className="px-3 py-1.5 border border-ink-200 rounded text-[9px] font-bold uppercase text-ink-600 hover:border-amber-400 hover:text-amber-600">TEST SUPPLY</button>
             <button onClick={() => runner.startScenario('TRANSPORT_ONLY')} className="px-3 py-1.5 border border-ink-200 rounded text-[9px] font-bold uppercase text-ink-600 hover:border-blood-400 hover:text-blood-600">TEST TRANSPORT</button>
             <button onClick={() => runner.startScenario('FACILITY_ONLY')} className="px-3 py-1.5 border border-ink-200 rounded text-[9px] font-bold uppercase text-ink-600 hover:border-blood-400 hover:text-blood-600">TEST FACILITY</button>
             <button onClick={() => runner.startScenario('EXPIRY_ONLY')} className="px-3 py-1.5 border border-ink-200 rounded text-[9px] font-bold uppercase text-ink-600 hover:border-amber-400 hover:text-amber-600">TEST EXPIRY</button>
           </div>
        )}

        {/* Core Layout Grid */}
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Left Column: Event Stream or Controls */}
          <div className="w-full xl:w-80 flex-shrink-0 flex flex-col gap-6 h-[400px] xl:h-auto">
             <LiveEventStream events={runner.eventStream} />
          </div>

          {/* Right Column: Visualization & Intelligence */}
          <div className="w-full flex-grow flex flex-col gap-6">
            
            <StressKPIs 
              resilience={activeResult.networkResilience}
              shortageExposure={activeResult.shortageExposure}
              facilitiesStressed={activeResult.stressedFacilities}
              bottleneckCount={activeResult.bottlenecks.length}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
              <NetworkTopology facilityStress={activeResult.facilityStress} isStressed={isStressed} />
              <DecisionDNA decisionDNA={activeResult.decisionDNA} isStressed={isStressed} />
            </div>

            <StressTimeline isStressed={isStressed} propagationStages={activeResult.stressPropagation} />
            
            {showFinalIntelligence ? (
              <div className="h-auto">
                <NetworkIntelligence baseline={baselineResult} active={activeResult} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FacilityStressTable facilityStress={activeResult.facilityStress} />
                  <BloodGroupStress bloodGroupStress={activeResult.bloodGroupStress} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-6">
                    <BottleneckPanel bottlenecks={activeResult.bottlenecks} />
                    <WeakLinkPanel weakestLink={activeResult.weakestLink} />
                  </div>
                  <div className="bg-ink-900 border border-ink-800 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col items-center justify-center p-8 text-center text-ink-500 italic text-sm">
                    {runner.state === 'IDLE' 
                      ? "Run a stress test to calculate final network intelligence." 
                      : "Simulating final intelligence... wait for network reassessment."}
                  </div>
                </div>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
