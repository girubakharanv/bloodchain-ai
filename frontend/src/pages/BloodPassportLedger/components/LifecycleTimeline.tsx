import React from 'react';
import { BloodUnit } from '../data/bloodPassportData';
import { Activity } from 'lucide-react';
import { VerificationResult } from '../utils/ledgerIntegrityEngine';

interface LifecycleTimelineProps {
  unit: BloodUnit;
  verificationResult: VerificationResult | null;
  activeEventIndex: number;
}

const LIFECYCLE_STAGES = [
  'COLLECTION',
  'PROCESSING',
  'STORAGE',
  'ALLOCATED',
  'DISPATCH',
  'TRANSIT UPDATE',
  'ARRIVED'
];

export const LifecycleTimeline: React.FC<LifecycleTimelineProps> = ({ unit, verificationResult, activeEventIndex }) => {
  // Check if we hit a terminal terminal state (Expired/Quarantined)
  const isTerminal = unit.currentState === 'EXPIRED' || unit.currentState === 'QUARANTINED';
  
  const mismatchIndex = verificationResult?.firstMismatchIndex;

  return (
    <div className="bg-white border border-ink-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-ink-200 flex items-center gap-2">
        <Activity className="w-4 h-4 text-ink-400" />
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-widest">
          LIFECYCLE TIMELINE
        </h3>
      </div>
      
      <div className="p-6 flex-grow overflow-x-auto">
        <div className="relative min-w-[600px] h-full py-8">
          {/* Main Line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-ink-200 -translate-y-1/2" />
          
          {/* Active Line (up to activeEventIndex, or up to mismatch if it exists) */}
          <div 
            className={`absolute top-1/2 left-4 h-0.5 -translate-y-1/2 transition-all duration-1000 ${
              mismatchIndex !== null && mismatchIndex !== undefined && mismatchIndex <= activeEventIndex ? 'bg-amber-500' : 
              isTerminal && activeEventIndex === unit.events.length - 1 ? 'bg-blood-500' : 'bg-emerald-500'
            }`}
            style={{ 
              width: `${Math.max(5, ((Math.min(activeEventIndex, mismatchIndex !== null && mismatchIndex !== undefined ? mismatchIndex : activeEventIndex)) / LIFECYCLE_STAGES.length) * 100)}%` 
            }}
          />

          <div className="relative flex justify-between h-full items-center">
            {LIFECYCLE_STAGES.map((stageStr, idx) => {
              // Find matching event index
              const eventIndex = unit.events.findIndex(e => e.event === stageStr);
              const event = eventIndex >= 0 && eventIndex <= activeEventIndex ? unit.events[eventIndex] : undefined;
              
              const isPast = eventIndex >= 0 && eventIndex < activeEventIndex;
              const isCurrent = eventIndex === activeEventIndex;
              const isFuture = eventIndex > activeEventIndex || eventIndex < 0; // Negative means this stage isn't reached yet in the unit's lifecycle
              const terminalInterrupt = isTerminal && isCurrent && eventIndex === unit.events.length - 1;

              // Verification status
              let nodeState = 'normal';
              if (event) {
                if (verificationResult?.valid === false) {
                  if (eventIndex === mismatchIndex) {
                    nodeState = 'invalid';
                  } else if (mismatchIndex !== null && mismatchIndex !== undefined && eventIndex > mismatchIndex) {
                    nodeState = 'unverified';
                  }
                }
              }

              return (
                <div key={stageStr} className="relative flex flex-col items-center group w-24">
                  {/* Top info (Timestamp / Terminal State) */}
                  <div className="absolute -top-12 w-32 text-center">
                    {terminalInterrupt ? (
                      <div className="text-[10px] font-bold text-blood-500 bg-blood-50 px-2 py-0.5 rounded border border-blood-200 inline-block">
                        {unit.currentState}
                      </div>
                    ) : nodeState === 'invalid' ? (
                      <div className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                        INVALID
                      </div>
                    ) : nodeState === 'unverified' ? (
                      <div className="text-[10px] font-bold text-ink-500 bg-ink-100 px-2 py-0.5 rounded border border-ink-200 inline-block">
                        UNVERIFIED
                      </div>
                    ) : event ? (
                      <div className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded inline-block ${
                        isCurrent ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-ink-100 text-ink-900 border border-transparent'
                      }`}>
                        {event.timestamp}
                      </div>
                    ) : null}
                  </div>
                  
                  {/* Node */}
                  <div className={`w-4 h-4 rounded-full border-2 z-10 transition-colors duration-500 ${
                    isFuture 
                      ? 'bg-white border-ink-300' 
                      : nodeState === 'invalid'
                        ? 'bg-amber-500 border-amber-200 ring-4 ring-amber-100'
                        : nodeState === 'unverified'
                          ? 'bg-ink-200 border-ink-300'
                          : terminalInterrupt 
                            ? 'bg-blood-500 border-blood-200 ring-4 ring-blood-100'
                            : isCurrent 
                              ? 'bg-emerald-500 border-white ring-4 ring-emerald-100 shadow-lg shadow-emerald-500/50'
                              : isPast 
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'bg-white border-ink-300'
                  }`} />
                  
                  {/* Bottom info (Stage Name & Location) */}
                  <div className="absolute -bottom-16 w-32 text-center flex flex-col items-center gap-1">
                    <div className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${
                      nodeState === 'invalid' ? 'text-amber-600' :
                      nodeState === 'unverified' ? 'text-ink-300' :
                      terminalInterrupt ? 'text-blood-600' : 
                      isCurrent ? 'text-emerald-700' :
                      isPast ? 'text-ink-900' : 'text-ink-400'
                    }`}>
                      {stageStr.replace(' UPDATE', '')}
                    </div>
                    {event && (
                      <div className={`text-[9px] uppercase tracking-wider leading-tight w-24 truncate ${
                        nodeState === 'invalid' || nodeState === 'unverified' ? 'text-ink-300' : 
                        isCurrent ? 'text-ink-700 font-bold' : 'text-ink-500'
                      }`} title={event.location}>
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
