import { useState, useEffect, useRef, useCallback } from 'react';

export type SimulationState = 'IDLE' | 'RUNNING' | 'PAUSED' | 'FINISHED';
export type SimulationStage = 
  | 'BASELINE' 
  | 'PREDICT' 
  | 'SIMULATE' 
  | 'DECIDE' 
  | 'VERIFY' 
  | 'OPTIMIZE' 
  | 'MEASURE'
  | 'COMPLETE';

export interface SimulationEvent {
  time: string;
  message: string;
}

export interface UseSimulationControllerReturn {
  state: SimulationState;
  stage: SimulationStage;
  progress: number;
  speed: number;
  events: SimulationEvent[];
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  setSpeed: (speed: number) => void;
  startJuryDemo: () => void;
  startBreakRecover: () => void;
}

const STAGES: SimulationStage[] = [
  'BASELINE', 'PREDICT', 'SIMULATE', 'DECIDE', 'VERIFY', 'OPTIMIZE', 'MEASURE', 'COMPLETE'
];

const STAGE_DURATION_MS = 2000;

export const useSimulationController = (): UseSimulationControllerReturn => {
  const [state, setState] = useState<SimulationState>('IDLE');
  const [stage, setStage] = useState<SimulationStage>('BASELINE');
  const [progress, setProgress] = useState(0); // 0 to 100 overall
  const [speed, setSpeed] = useState(1);
  const [events, setEvents] = useState<SimulationEvent[]>([]);

  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const pausedTimeRef = useRef<number>(0);
  const totalDuration = (STAGES.length - 1) * STAGE_DURATION_MS;

  const addEvent = useCallback((message: string) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setEvents(prev => [{ time, message }, ...prev].slice(0, 10)); // keep last 10
  }, []);

  const tick = useCallback((time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time - pausedTimeRef.current;
    
    const elapsed = (time - startTimeRef.current) * speed;
    let p = Math.min((elapsed / totalDuration) * 100, 100);
    
    setProgress(p);

    const currentStageIndex = Math.min(Math.floor(elapsed / STAGE_DURATION_MS), STAGES.length - 1);
    const newStage = STAGES[currentStageIndex];
    
    if (newStage !== stage) {
      setStage(newStage);
      // Emit events based on stage transitions
      if (newStage === 'PREDICT') addEvent('Expiry exposure detected');
      if (newStage === 'SIMULATE') addEvent('Demand pressure evaluated');
      if (newStage === 'DECIDE') addEvent('Allocation conflict resolved');
      if (newStage === 'VERIFY') {
        addEvent('Route selected');
        addEvent('Cold-chain status checked');
        addEvent('Lifecycle integrity verified');
      }
      if (newStage === 'OPTIMIZE') addEvent('Network resilience reassessed');
      if (newStage === 'MEASURE') addEvent('Impact measured');
    }

    if (p >= 100) {
      setState('FINISHED');
      setStage('COMPLETE');
      return;
    }

    if (state === 'RUNNING') {
      requestRef.current = requestAnimationFrame(tick);
    }
  }, [state, speed, totalDuration, stage, addEvent]);

  useEffect(() => {
    if (state === 'RUNNING') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setProgress(100);
        setStage('COMPLETE');
        setState('FINISHED');
        return;
      }
      
      requestRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [state, tick]);

  const startSimulation = () => {
    if (state === 'IDLE' || state === 'FINISHED') {
      startTimeRef.current = undefined;
      pausedTimeRef.current = 0;
      setEvents([]);
      setProgress(0);
      setStage('BASELINE');
    }
    setState('RUNNING');
  };

  const pauseSimulation = () => {
    setState('PAUSED');
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      if (startTimeRef.current) {
        pausedTimeRef.current = performance.now() - startTimeRef.current;
      }
    }
  };

  const resetSimulation = () => {
    setState('IDLE');
    setStage('BASELINE');
    setProgress(0);
    setEvents([]);
    startTimeRef.current = undefined;
    pausedTimeRef.current = 0;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const startJuryDemo = () => {
    resetSimulation();
    setSpeed(1);
    setTimeout(() => startSimulation(), 100);
  };

  const startBreakRecover = () => {
    resetSimulation();
    setSpeed(1.5);
    setTimeout(() => {
      addEvent('NETWORK STRESS DETECTED');
      addEvent('Initiating BloodChain Optimization');
      startSimulation();
    }, 100);
  };

  return {
    state,
    stage,
    progress,
    speed,
    events,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setSpeed,
    startJuryDemo,
    startBreakRecover
  };
};
