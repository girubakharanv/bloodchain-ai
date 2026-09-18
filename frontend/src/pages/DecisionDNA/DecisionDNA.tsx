import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Network } from 'lucide-react';
import { generateDecisionDNA } from './utils/decisionDnaEngine';
import { ScenarioType } from './utils/decisionDnaIntegration';

import { DecisionSnapshot } from './components/DecisionSnapshot';
import { DriverRanking } from './components/DriverRanking';
import { DecisionExplanation } from './components/DecisionExplanation';
import { DecisionTrace } from './components/DecisionTrace';
import { CompetingFactors } from './components/CompetingFactors';
import { EvidenceModules } from './components/EvidenceModules';
import { CounterfactualPreview } from './components/CounterfactualPreview';
import { DecisionAudit } from './components/DecisionAudit';
import { HumanReview } from './components/HumanReview';
import { PlaybackControls } from './components/PlaybackControls';

export const DecisionDNA: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('SCENARIO_A');
  const [counterfactualOverrides, setCounterfactualOverrides] = useState<Record<string, string>>({});

  // Playback state
  const [decisionTraceActive, setDecisionTraceActive] = useState(false);
  const [currentTraceStage, setCurrentTraceStage] = useState<number>(7); // Default to fully complete (7 stages: 0-6)
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Interaction State
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [humanReviewStatus, setHumanReviewStatus] = useState<'REQUIRED' | 'APPROVAL_RECORDED' | 'ADJUSTMENT_MODE'>('REQUIRED');

  const dnaResult = useMemo(() => {
    return generateDecisionDNA(activeScenario, counterfactualOverrides);
  }, [activeScenario, counterfactualOverrides]);

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveScenario(e.target.value as ScenarioType);
    handleReset();
  };

  const handleCounterfactualChange = (overrides: Record<string, string>) => {
    setCounterfactualOverrides(overrides);
  };

  const handleReset = () => {
    setCounterfactualOverrides({});
    setDecisionTraceActive(false);
    setCurrentTraceStage(7); // show all
    setDemoPlaying(false);
    setSelectedDriver(null);
    setSelectedEvidence(null);
    setHumanReviewStatus('REQUIRED');
    setPlaybackSpeed(1);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTraceDecision = () => {
    if (currentTraceStage === 7) {
      setCurrentTraceStage(0);
    }
    setDecisionTraceActive(true);
    setDemoPlaying(true);
  };

  const handleJuryDemo = () => {
    handleReset();
    setTimeout(() => {
      setCurrentTraceStage(0);
      setDecisionTraceActive(true);
      setDemoPlaying(true);
      setPlaybackSpeed(1);
    }, 100);
  };

  const togglePlay = () => {
    if (currentTraceStage >= 7) {
      setCurrentTraceStage(0);
    }
    setDemoPlaying(!demoPlaying);
  };

  useEffect(() => {
    if (demoPlaying && currentTraceStage < 7) {
      timerRef.current = setInterval(() => {
        setCurrentTraceStage((prev) => {
          if (prev >= 6) {
            setDemoPlaying(false);
            return 7;
          }
          return prev + 1;
        });
      }, 2000 / playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [demoPlaying, currentTraceStage, playbackSpeed]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4 md:p-8 overflow-x-hidden animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Scenario Selector */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-[10px] font-bold tracking-[0.2em] text-blood-700 uppercase flex items-center gap-2">
                <Network className="w-4 h-4" /> DECISION INTELLIGENCE
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-[9px] font-bold tracking-widest text-emerald-600 uppercase">
                  EXPLAINABILITY ACTIVE
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-editorial font-bold text-ink-900 mb-2">
              Decision DNA™
            </h1>
            <p className="text-ink-600 text-sm max-w-xl italic border-l-2 border-blood-600 pl-4 mb-2">
              "See why the network made the call."
            </p>
            <p className="text-ink-500 text-xs max-w-xl pl-4">
              Trace the operational factors behind every BloodChain recommendation.
            </p>
          </div>
          
          <div className="flex flex-col">
            <label className="text-[10px] font-bold tracking-widest text-ink-500 uppercase mb-1">
              Select Network Scenario
            </label>
            <select 
              value={activeScenario}
              onChange={handleScenarioChange}
              className="bg-white border border-ink-200 text-ink-900 text-sm rounded-lg focus:ring-blood-500 focus:border-blood-500 block w-full p-2.5 shadow-sm"
            >
              <option value="SCENARIO_A">Scenario A: Constrained O+ Allocation</option>
              <option value="SCENARIO_B">Scenario B: High Expiry Pressure</option>
              <option value="SCENARIO_C">Scenario C: Transport Disruption</option>
              <option value="SCENARIO_D">Scenario D: Cold-Chain Risk Escalation</option>
              <option value="SCENARIO_E">Scenario E: Regional Collection Shortage</option>
              <option value="SCENARIO_F">Scenario F: Network Stress Event</option>
            </select>
          </div>
        </header>

        {decisionTraceActive && (
          <div className="sticky top-0 z-50 py-4 bg-[#fcfcfc]/90 backdrop-blur">
            <PlaybackControls 
              isPlaying={demoPlaying}
              onPlay={togglePlay}
              onPause={() => setDemoPlaying(false)}
              onReset={handleReset}
              onJuryDemo={handleJuryDemo}
              playbackSpeed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
            />
          </div>
        )}

        {/* Section 1: Snapshot */}
        <DecisionSnapshot 
          record={dnaResult.decision} 
          onTraceDecision={handleTraceDecision}
          isTracing={decisionTraceActive}
          currentStage={currentTraceStage}
        />

        {/* Sections 2 & 3: Drivers & Explanation */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1">
            <DriverRanking 
              drivers={dnaResult.drivers} 
              currentStage={currentTraceStage} 
              selectedDriver={selectedDriver}
              onDriverClick={setSelectedDriver}
            />
          </div>
          <div className="xl:col-span-2">
            <DecisionExplanation explanation={dnaResult.explanation} currentStage={currentTraceStage} />
          </div>
        </div>

        {/* Section 4: Visual Trace */}
        <DecisionTrace 
          nodes={dnaResult.causalChain} 
          currentStage={currentTraceStage}
          selectedEvidence={selectedEvidence}
        />

        {/* Section 5: Competing Factors */}
        <CompetingFactors 
          drivers={dnaResult.drivers} 
          alternative={dnaResult.alternative} 
          decision={dnaResult.decision}
          currentStage={currentTraceStage} 
        />

        {/* Section 6: Source Modules */}
        <EvidenceModules 
          evidence={dnaResult.evidence} 
          currentStage={currentTraceStage}
          selectedEvidence={selectedEvidence}
          onEvidenceClick={setSelectedEvidence}
        />

        {/* Section 7: Counterfactual Preview */}
        <CounterfactualPreview 
          scenarios={dnaResult.counterfactuals} 
          onOverrideChange={handleCounterfactualChange} 
          currentDecision={dnaResult.decision}
          alternative={dnaResult.alternative}
          currentStage={currentTraceStage}
        />

        {/* Sections 8 & 9: Audit Trail & Human Review */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <DecisionAudit 
              events={dnaResult.auditEvents} 
              currentStage={currentTraceStage}
              onEventClick={(stage) => {
                setCurrentTraceStage(stage);
                setDemoPlaying(false);
                setDecisionTraceActive(true);
              }}
            />
          </div>
          <div className="xl:col-span-1">
            <HumanReview 
              required={dnaResult.humanReviewRequired} 
              status={humanReviewStatus}
              onStatusChange={setHumanReviewStatus}
              currentStage={currentTraceStage}
            />
          </div>
        </div>

        {/* Section 10: Safety Boundary */}
        <footer className="mt-16 pt-8 border-t border-ink-200 text-center">
          <p className="text-[10px] text-ink-400 max-w-3xl mx-auto leading-relaxed">
            Decision DNA is a logistics explainability layer for BloodChain AI. 
            Recommendations are operational decision-support outputs and require human review. 
            It does not determine transfusion suitability, diagnosis, donor eligibility, or clinical treatment.
          </p>
        </footer>
        
      </div>
    </div>
  );
};
