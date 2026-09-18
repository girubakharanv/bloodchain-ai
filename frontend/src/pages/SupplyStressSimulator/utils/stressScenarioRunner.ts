import { useState, useEffect, useRef, useCallback } from 'react';
import { StressModifiers } from './supplyStressEngine';

export type SimulationState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'FINISHED';

export type ScenarioType = 
  | 'COMBINED' 
  | 'DEMAND_ONLY' 
  | 'SUPPLY_ONLY' 
  | 'TRANSPORT_ONLY' 
  | 'FACILITY_ONLY' 
  | 'EXPIRY_ONLY';

export interface EventStreamLog {
  id: string;
  timestamp: string; // Simulated HH:MM:SS
  message: string;
}

const INITIAL_MODIFIERS: StressModifiers = {
  demand: 0,
  supply: 0,
  collection: 0,
  transportDelay: 0,
  facilityOutage: 0,
  expiryPressure: 0
};

// Target parameters for COMBINED full scenario
const TARGET_MODIFIERS_COMBINED: StressModifiers = {
  demand: 40,
  supply: -30,
  collection: 0,
  transportDelay: 60,
  facilityOutage: 1,
  expiryPressure: 0
};

// A stage describes what happens during a time window
interface SimulationStage {
  name: string;
  durationMs: number;
  message: string;
  applyModifiers: (current: StressModifiers) => StressModifiers;
}

const getStagesForScenario = (scenarioType: ScenarioType): SimulationStage[] => {
  if (scenarioType === 'COMBINED') {
    return [
      {
        name: 'BASELINE',
        durationMs: 2000,
        message: 'Network operating within normal parameters.',
        applyModifiers: () => ({ ...INITIAL_MODIFIERS })
      },
      {
        name: 'DEMAND SURGE',
        durationMs: 2000,
        message: 'Demand surge detected. Increasing allocation pressure.',
        applyModifiers: (prev) => ({ ...prev, demand: 40 })
      },
      {
        name: 'SUPPLY SHOCK',
        durationMs: 2000,
        message: 'Supply pressure increasing. Available reserves restricted.',
        applyModifiers: (prev) => ({ ...prev, supply: -30 })
      },
      {
        name: 'TRANSPORT DISRUPTION',
        durationMs: 2000,
        message: 'Transport corridor delay applied.',
        applyModifiers: (prev) => ({ ...prev, transportDelay: 60 })
      },
      {
        name: 'FACILITY OUTAGE',
        durationMs: 2000,
        message: 'Facility disruption detected. Downstream stress propagated.',
        applyModifiers: (prev) => ({ ...prev, facilityOutage: 1 })
      },
      {
        name: 'NETWORK REASSESSMENT',
        durationMs: 2000,
        message: 'Bottlenecks detected. Network reassessment complete.',
        applyModifiers: (prev) => ({ ...prev }) // Modifiers stay the same, just time to compute final effects
      },
      {
        name: 'FINAL STATE',
        durationMs: 2000,
        message: 'Simulation complete.',
        applyModifiers: (prev) => ({ ...prev })
      }
    ];
  } else if (scenarioType === 'DEMAND_ONLY') {
    return [
      { name: 'BASELINE', durationMs: 2000, message: 'Network operating within normal parameters.', applyModifiers: () => ({ ...INITIAL_MODIFIERS }) },
      { name: 'DEMAND SURGE', durationMs: 4000, message: 'Demand surge detected.', applyModifiers: (prev) => ({ ...prev, demand: 60 }) },
      { name: 'NETWORK REASSESSMENT', durationMs: 2000, message: 'Network reassessment complete.', applyModifiers: (prev) => ({ ...prev }) },
      { name: 'FINAL STATE', durationMs: 1000, message: 'Simulation complete.', applyModifiers: (prev) => ({ ...prev }) }
    ];
  } else if (scenarioType === 'SUPPLY_ONLY') {
    return [
      { name: 'BASELINE', durationMs: 2000, message: 'Network operating within normal parameters.', applyModifiers: () => ({ ...INITIAL_MODIFIERS }) },
      { name: 'SUPPLY SHOCK', durationMs: 4000, message: 'Supply pressure increasing.', applyModifiers: (prev) => ({ ...prev, supply: -50 }) },
      { name: 'NETWORK REASSESSMENT', durationMs: 2000, message: 'Network reassessment complete.', applyModifiers: (prev) => ({ ...prev }) },
      { name: 'FINAL STATE', durationMs: 1000, message: 'Simulation complete.', applyModifiers: (prev) => ({ ...prev }) }
    ];
  } else if (scenarioType === 'TRANSPORT_ONLY') {
     return [
      { name: 'BASELINE', durationMs: 2000, message: 'Network operating within normal parameters.', applyModifiers: () => ({ ...INITIAL_MODIFIERS }) },
      { name: 'TRANSPORT DISRUPTION', durationMs: 4000, message: 'Transport corridor delay applied.', applyModifiers: (prev) => ({ ...prev, transportDelay: 120 }) },
      { name: 'NETWORK REASSESSMENT', durationMs: 2000, message: 'Network reassessment complete.', applyModifiers: (prev) => ({ ...prev }) },
      { name: 'FINAL STATE', durationMs: 1000, message: 'Simulation complete.', applyModifiers: (prev) => ({ ...prev }) }
    ];
  } else if (scenarioType === 'FACILITY_ONLY') {
    return [
      { name: 'BASELINE', durationMs: 2000, message: 'Network operating within normal parameters.', applyModifiers: () => ({ ...INITIAL_MODIFIERS }) },
      { name: 'FACILITY OUTAGE', durationMs: 4000, message: 'Facility disruption detected.', applyModifiers: (prev) => ({ ...prev, facilityOutage: 1 }) },
      { name: 'NETWORK REASSESSMENT', durationMs: 2000, message: 'Network reassessment complete.', applyModifiers: (prev) => ({ ...prev }) },
      { name: 'FINAL STATE', durationMs: 1000, message: 'Simulation complete.', applyModifiers: (prev) => ({ ...prev }) }
    ];
  } else if (scenarioType === 'EXPIRY_ONLY') {
    return [
      { name: 'BASELINE', durationMs: 2000, message: 'Network operating within normal parameters.', applyModifiers: () => ({ ...INITIAL_MODIFIERS }) },
      { name: 'EXPIRY WAVE', durationMs: 4000, message: 'High expiry pressure detected.', applyModifiers: (prev) => ({ ...prev, expiryPressure: 40 }) },
      { name: 'NETWORK REASSESSMENT', durationMs: 2000, message: 'Network reassessment complete.', applyModifiers: (prev) => ({ ...prev }) },
      { name: 'FINAL STATE', durationMs: 1000, message: 'Simulation complete.', applyModifiers: (prev) => ({ ...prev }) }
    ];
  }
  return [];
};

export const useStressScenarioRunner = () => {
  const [state, setState] = useState<SimulationState>('IDLE');
  const [activeScenario, setActiveScenario] = useState<ScenarioType | null>(null);
  const [modifiers, setModifiers] = useState<StressModifiers>(INITIAL_MODIFIERS);
  const [eventStream, setEventStream] = useState<EventStreamLog[]>([]);
  
  // Track timeline
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stages, setStages] = useState<SimulationStage[]>([]);
  
  const timerRef = useRef<number | null>(null);
  
  // Create a simulated clock starting at 10:41:00
  const [simClockMs, setSimClockMs] = useState(0); 
  const BASE_TIME = new Date("2026-09-13T10:41:00").getTime();

  const getSimTimeString = (offsetMs: number) => {
    const d = new Date(BASE_TIME + offsetMs * 2); // Accelerate clock slightly for drama
    return d.toTimeString().split(' ')[0]; // HH:MM:SS
  };

  const addEvent = (msg: string, timeMs: number) => {
    setEventStream(prev => [
      ...prev,
      { id: Date.now().toString() + Math.random(), timestamp: getSimTimeString(timeMs), message: msg }
    ]);
  };

  const startScenario = useCallback((type: ScenarioType) => {
    const s = getStagesForScenario(type);
    setStages(s);
    setActiveScenario(type);
    setState('PLAYING');
    setCurrentStageIndex(0);
    setModifiers(INITIAL_MODIFIERS);
    setEventStream([]);
    setSimClockMs(0);
  }, []);

  const pause = useCallback(() => {
    if (state === 'PLAYING') setState('PAUSED');
  }, [state]);

  const resume = useCallback(() => {
    if (state === 'PAUSED') setState('PLAYING');
  }, [state]);

  const reset = useCallback(() => {
    setState('IDLE');
    setActiveScenario(null);
    setModifiers(INITIAL_MODIFIERS);
    setCurrentStageIndex(0);
    setEventStream([]);
    setSimClockMs(0);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const replay = useCallback(() => {
    if (activeScenario) {
      if (timerRef.current) clearTimeout(timerRef.current);
      startScenario(activeScenario);
    }
  }, [activeScenario, startScenario]);

  useEffect(() => {
    if (state === 'PLAYING' && stages.length > 0) {
      if (currentStageIndex >= stages.length) {
        setState('FINISHED');
        return;
      }

      const stage = stages[currentStageIndex];
      
      // Apply modifiers immediately upon entering stage
      setModifiers(stage.applyModifiers(modifiers));
      
      // Add event log
      addEvent(stage.message, simClockMs);

      // Wait for duration, then proceed
      timerRef.current = window.setTimeout(() => {
        setSimClockMs(prev => prev + stage.durationMs);
        setCurrentStageIndex(prev => prev + 1);
      }, stage.durationMs);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state, currentStageIndex, stages]); // Removed modifiers & simClockMs from dep array to avoid re-triggering the same stage

  return {
    state,
    activeScenario,
    modifiers,
    eventStream,
    stages,
    currentStageIndex,
    startScenario,
    pause,
    resume,
    reset,
    replay
  };
};
