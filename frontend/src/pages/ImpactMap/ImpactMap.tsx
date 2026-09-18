import React, { useState } from 'react';
import { Target, RotateCcw, Play } from 'lucide-react';
import { generateImpactAnalysis } from './utils/impactMapEngine';
import { ImpactScenario } from './types/impactMap';

import { ImpactHero } from './components/impact-map/ImpactHero';
import { BeforeAfter } from './components/impact-map/BeforeAfter';
import { NetworkImpactMap } from './components/impact-map/NetworkImpactMap';
import { RegionalImpact } from './components/impact-map/RegionalImpact';
import { BloodGroupImpact } from './components/impact-map/BloodGroupImpact';
import { ImpactAttribution } from './components/impact-map/ImpactAttribution';
import { ImpactCascade } from './components/impact-map/ImpactCascade';
import { RescuedUnits } from './components/impact-map/RescuedUnits';
import { ShortageExposure } from './components/impact-map/ShortageExposure';
import { ResilienceScore } from './components/impact-map/ResilienceScore';
import { ImpactStory } from './components/impact-map/ImpactStory';
import { EvidenceStrip } from './components/impact-map/EvidenceStrip';
import { ScenarioSelector } from './components/impact-map/ScenarioSelector';
import { ImpactTimeline } from './components/impact-map/ImpactTimeline';
import { EventStream } from './components/impact-map/EventStream';
import { BloodChainIntelligenceStack } from './components/impact-map/BloodChainIntelligenceStack';
import { FinalImpactStatement } from './components/impact-map/FinalImpactStatement';
import { useSimulationController } from './utils/impactMapSimulationController';

export const ImpactMap: React.FC = () => {
  const [scenarioId, setScenarioId] = useState<ImpactScenario>('NORMAL_NETWORK');
  const [previousScenarioId, setPreviousScenarioId] = useState<ImpactScenario | null>(null);
  
  const simulation = useSimulationController();
  const data = generateImpactAnalysis(scenarioId);

  const handleScenarioChange = (newScenario: ImpactScenario) => {
    setPreviousScenarioId(scenarioId);
    setScenarioId(newScenario);
    simulation.resetSimulation();
  };

  const handleReset = () => {
    setScenarioId('NORMAL_NETWORK');
    setPreviousScenarioId(null);
    simulation.resetSimulation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 space-y-8 animate-fade-in">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-blood-600 mb-4">
            <Target className="w-5 h-5" />
            <span className="text-sm font-bold tracking-widest uppercase">NETWORK IMPACT INTELLIGENCE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-editorial text-ink-900 mb-4">
            Blood Rescue Impact Map™
          </h1>
          <p className="text-xl text-ink-600 font-editorial italic max-w-2xl">
            Measure what changed across the network.
          </p>
          <p className="text-sm text-ink-500 mt-2">
            Compare modeled baseline conditions with BloodChain's optimized logistics decisions.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            IMPACT ANALYSIS READY
          </div>
          
          <button 
            onClick={simulation.startJuryDemo}
            className="flex items-center gap-2 px-4 py-2 bg-ink-900 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-ink-800 transition-colors"
          >
            JURY DEMO
          </button>

          <button 
            onClick={simulation.startBreakRecover}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-amber-700 transition-colors"
          >
            BREAK → RECOVER
          </button>
          
          <button 
            onClick={() => simulation.state === 'RUNNING' ? simulation.pauseSimulation() : simulation.startSimulation()}
            className="flex items-center gap-2 px-4 py-2 bg-blood-600 text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-blood-700 transition-colors"
          >
            <Play className="w-3 h-3" fill="currentColor" /> {simulation.state === 'RUNNING' ? 'PAUSE' : 'RUN IMPACT ANALYSIS'}
          </button>
          
          <button 
            onClick={handleReset}
            className="p-2 border border-ink-200 text-ink-500 rounded hover:bg-ink-50 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {simulation.state !== 'IDLE' && (
        <div className="bg-ink-900 text-white p-3 rounded-lg flex items-center justify-between shadow-lg sticky top-4 z-40 mb-8 border border-ink-800">
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-ink-400">
              STAGE: <span className="text-emerald-400 ml-1">{simulation.stage}</span>
            </div>
            <div className="w-64 h-2 bg-ink-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blood-500 transition-all duration-300 ease-linear"
                style={{ width: `${simulation.progress}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {[0.5, 1, 2].map(s => (
              <button 
                key={s}
                onClick={() => simulation.setSpeed(s)}
                className={`px-2 py-1 text-[10px] font-bold rounded ${simulation.speed === s ? 'bg-ink-700 text-white' : 'text-ink-500 hover:text-white'}`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      )}

      <ScenarioSelector 
        selectedScenario={scenarioId} 
        onScenarioChange={handleScenarioChange} 
      />

      <ImpactHero kpis={data.kpis} progress={simulation.progress} />

      <EvidenceStrip attribution={data.attribution} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {simulation.stage === 'COMPLETE' ? (
          <BeforeAfter comparison={data.comparison} />
        ) : (
          <BloodChainIntelligenceStack currentStage={simulation.stage} />
        )}
        <NetworkImpactMap regions={data.regions} progress={simulation.progress} stage={simulation.stage} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <RegionalImpact regions={data.regions} />
        </div>
        <div>
          <ImpactCascade currentStage={simulation.stage} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <BloodGroupImpact bloodGroups={data.bloodGroups} />
        </div>
        <div>
          <ImpactAttribution attribution={data.attribution} show={simulation.stage === 'MEASURE' || simulation.stage === 'COMPLETE'} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <RescuedUnits rescuedCount={data.rescuedUnits} progress={simulation.progress} stage={simulation.stage} />
        <ShortageExposure metrics={data.shortageExposure} progress={simulation.progress} stage={simulation.stage} />
        <ResilienceScore metrics={data.resilience} progress={simulation.progress} stage={simulation.stage} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <ImpactStory story={data.story} show={simulation.stage === 'MEASURE' || simulation.stage === 'COMPLETE'} />
        </div>
        <div className="flex flex-col gap-8">
          <EventStream events={simulation.events} />
          <ImpactTimeline timeline={data.timeline} />
        </div>
      </div>

      <FinalImpactStatement show={simulation.stage === 'COMPLETE' && simulation.state === 'FINISHED'} />

      {/* SAFETY CLAIM BOUNDARY */}
      <div className="mt-16 pt-8 border-t border-ink-200 text-center text-xs text-ink-400 max-w-3xl mx-auto">
        Blood Rescue Impact Map™ presents modeled logistics outcomes from simulated BloodChain scenarios. 
        It is not clinical validation and does not measure patient outcomes or lives saved.
      </div>
    </div>
  );
};

export default ImpactMap;
