import React from 'react';
import { DecisionRecord } from '../types/decisionDna';
import { BrainCircuit, Clock, Network, Activity } from 'lucide-react';

interface DecisionSnapshotProps {
  record: DecisionRecord;
  onTraceDecision: () => void;
  isTracing: boolean;
  currentStage: number;
}

export const DecisionSnapshot: React.FC<DecisionSnapshotProps> = ({ 
  record, 
  onTraceDecision,
  isTracing,
  currentStage
}) => {
  const isDecisionStage = currentStage >= 5;

  return (
    <div className={`border rounded-2xl p-8 relative overflow-hidden shadow-lg transition-all duration-700 ${
      isDecisionStage 
        ? 'bg-ink-900 border-ink-800' 
        : 'bg-ink-950 border-ink-900 opacity-90'
    }`}>
      {isDecisionStage && (
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blood-900/40 via-transparent to-transparent pointer-events-none transition-opacity duration-1000 animate-fade-in" />
      )}
      
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 relative z-10">
        <div className="flex-grow transition-opacity duration-500">
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 border text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 rounded-full transition-colors duration-500 ${
              isDecisionStage 
                ? 'bg-blood-500/10 border-blood-500/30 text-blood-400'
                : 'bg-ink-800 border-ink-700 text-ink-500'
            }`}>
              <BrainCircuit className="w-3 h-3" />
              {record.type}
            </span>
          </div>
          
          <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-2 transition-colors duration-500">
            {isDecisionStage ? 'RECOMMENDED DECISION' : 'ANALYZING NETWORK CONDITIONS...'}
          </div>
          <h2 className={`text-3xl md:text-4xl font-editorial font-bold mb-8 leading-tight transition-all duration-700 ${
            isDecisionStage ? 'text-white' : 'text-ink-600 blur-[2px]'
          }`}>
            {record.recommendation}
          </h2>
          
          <div className={`flex flex-wrap gap-6 transition-opacity duration-500 ${isDecisionStage ? 'opacity-100' : 'opacity-40'}`}>
            <div>
              <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Network className="w-3 h-3" /> Source
              </div>
              <div className="text-sm font-bold text-ink-200">{record.sourceModule}</div>
            </div>
            
            <div>
              <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Activity className="w-3 h-3" /> Network State
              </div>
              <div className="text-sm font-bold text-ink-200">{record.networkStateContext}</div>
            </div>
            
            <div>
              <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Clock className="w-3 h-3" /> Timestamp
              </div>
              <div className="text-sm font-bold font-mono text-ink-200">
                {new Date(record.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center lg:items-end w-full lg:w-48 flex-shrink-0 transition-opacity duration-500">
          <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 text-center lg:text-right transition-colors duration-500 ${
            isDecisionStage ? 'text-ink-400' : 'text-ink-600'
          }`}>
            DECISION STRENGTH
          </div>
          <div className="w-32 h-32 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="stroke-ink-800 fill-none transition-colors duration-500" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" className={`fill-none transition-all duration-1000 ease-out ${
                isDecisionStage ? 'stroke-blood-500' : 'stroke-ink-700'
              }`} strokeWidth="8" 
                strokeDasharray="283" 
                strokeDashoffset={isDecisionStage ? (283 - (283 * record.strength) / 100) : 283}
                strokeLinecap="round" 
              />
            </svg>
            <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 ${
              isDecisionStage ? 'opacity-100' : 'opacity-0'
            }`}>
              <span className="text-3xl font-bold font-editorial text-white leading-none">{record.strength}</span>
              <span className="text-[10px] font-bold text-ink-400 mt-1">/ 100</span>
            </div>
          </div>
          
          <button 
            onClick={onTraceDecision}
            disabled={isTracing}
            className={`mt-6 w-full lg:w-auto px-6 py-3 border rounded text-[10px] font-bold tracking-widest uppercase transition-colors ${
              isTracing 
                ? 'border-ink-800 text-ink-600 bg-ink-900 cursor-not-allowed' 
                : 'border-ink-700 hover:border-blood-500 hover:bg-blood-900/20 text-white'
            }`}
          >
            {isTracing ? 'Tracing Decision...' : 'Trace Decision'}
          </button>
        </div>
      </div>
    </div>
  );
};
