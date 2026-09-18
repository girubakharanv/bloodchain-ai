import React from 'react';
import { History, CheckCircle2, Circle } from 'lucide-react';
import { DecisionAuditEvent } from '../types/decisionDna';

interface DecisionAuditProps {
  events: DecisionAuditEvent[];
  currentStage: number;
  onEventClick: (stage: number) => void;
}

export const DecisionAudit: React.FC<DecisionAuditProps> = ({ 
  events, 
  currentStage,
  onEventClick
}) => {
  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-8 shadow-sm h-full animate-fade-in transition-all">
      <div className="flex items-center gap-2 mb-8 border-b border-ink-100 pb-4">
        <History className="w-5 h-5 text-ink-400" />
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">
          DECISION AUDIT TRAIL
        </h3>
      </div>
      
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-2 w-px bg-ink-100" />
        
        <div className="space-y-4">
          {events.map((event, idx) => {
            const isCompleted = idx < currentStage || (idx === currentStage && currentStage === 7);
            const isActive = idx === currentStage && currentStage < 7;
            
            return (
              <button 
                key={event.id} 
                onClick={() => onEventClick(idx)}
                className={`relative flex items-start gap-6 w-full text-left p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-ink-50 -ml-2 pl-4 pr-2 ring-1 ring-ink-200' : 'hover:bg-ink-50 -ml-2 pl-4 pr-2'
                }`}
              >
                <div className="mt-0.5 bg-white z-10 relative">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : isActive ? (
                    <div className="w-4 h-4 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blood-500 animate-pulse" />
                    </div>
                  ) : (
                    <Circle className="w-4 h-4 text-ink-300" />
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className={`text-sm font-bold transition-colors ${
                    isCompleted || isActive ? 'text-ink-900' : 'text-ink-400'
                  }`}>
                    {event.step}
                  </div>
                </div>
                
                <div className={`text-[10px] font-mono tracking-wider transition-colors ${
                  isCompleted || isActive ? 'text-ink-500' : 'text-ink-300'
                }`}>
                  {event.timestamp}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
