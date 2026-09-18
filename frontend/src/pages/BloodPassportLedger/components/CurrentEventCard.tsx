import React from 'react';
import { BloodUnit } from '../data/bloodPassportData';
import { PlayCircle, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { VerificationResult } from '../utils/ledgerIntegrityEngine';

interface CurrentEventCardProps {
  unit: BloodUnit;
  activeEventIndex: number;
  verificationResult: VerificationResult | null;
  playbackState: string;
}

export const CurrentEventCard: React.FC<CurrentEventCardProps> = ({ 
  unit, 
  activeEventIndex,
  verificationResult,
  playbackState
}) => {
  const activeEvent = unit.events[activeEventIndex];

  // If playback completed
  if (playbackState === 'COMPLETED' && activeEventIndex === unit.events.length - 1) {
    return (
      <div className="bg-emerald-900 border border-emerald-800 rounded-2xl p-6 shadow-sm text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> JOURNEY COMPLETE
          </h3>
        </div>
        <div className="text-2xl font-editorial font-bold text-white mb-2 relative z-10">
          Destination Reached
        </div>
        <div className="text-sm text-emerald-200 relative z-10">
          Operational journey completed successfully.
        </div>
      </div>
    );
  }

  if (!activeEvent) return null;

  const isInvalid = verificationResult?.valid === false && activeEventIndex === verificationResult.firstMismatchIndex;

  return (
    <div className={`border rounded-2xl p-6 shadow-sm relative overflow-hidden transition-colors duration-500 ${
      isInvalid ? 'bg-amber-900 border-amber-800 text-white' : 'bg-white border-ink-200 text-ink-900'
    }`}>
      {isInvalid && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-600/40 via-transparent to-transparent pointer-events-none" />
      )}
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isInvalid ? 'text-amber-400' : 'text-blood-600'}`}>
          <PlayCircle className="w-4 h-4" /> CURRENT EVENT
        </h3>
        <div className={`font-mono text-xs ${isInvalid ? 'text-amber-200' : 'text-ink-500'}`}>
          {activeEvent.timestamp}
        </div>
      </div>

      <div className="relative z-10">
        <div className={`text-2xl font-editorial font-bold mb-4 ${isInvalid ? 'text-white' : 'text-ink-900'}`}>
          {activeEvent.event}
        </div>
        
        <div className="flex flex-col gap-4 mb-6">
          <div className={`text-sm font-bold ${isInvalid ? 'text-white' : 'text-ink-700'}`}>
            <span className={`text-[9px] uppercase tracking-widest mr-2 ${isInvalid ? 'text-amber-200' : 'text-ink-400'}`}>LOCATION</span><br/>
            {activeEvent.location}
          </div>
          <div className={`text-sm font-bold ${isInvalid ? 'text-white' : 'text-ink-700'}`}>
            <span className={`text-[9px] uppercase tracking-widest mr-2 ${isInvalid ? 'text-amber-200' : 'text-ink-400'}`}>ACTOR</span><br/>
            {activeEvent.actor}
          </div>
        </div>

        <div className="pt-4 border-t border-current opacity-20" />
        <div className="pt-4 flex items-center gap-2">
          {isInvalid ? (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold tracking-widest uppercase text-amber-500">LEDGER EXCEPTION</span>
            </>
          ) : (
            <>
              <ShieldCheck className={`w-4 h-4 ${isInvalid ? 'text-white' : 'text-emerald-500'}`} />
              <span className={`text-xs font-bold tracking-widest uppercase ${isInvalid ? 'text-white' : 'text-emerald-600'}`}>LEDGER VERIFIED</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
