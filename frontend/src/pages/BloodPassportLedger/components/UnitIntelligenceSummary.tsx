import React from 'react';
import { BloodUnit } from '../data/bloodPassportData';
import { 
  getUnitExpiryContext, 
  getUnitColdChainContext, 
  getUnitRouteContext, 
  getUnitAllocationContext 
} from '../utils/bloodPassportIntegration';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { VerificationResult } from '../utils/ledgerIntegrityEngine';

interface UnitIntelligenceSummaryProps {
  unit: BloodUnit;
  verificationResult: VerificationResult | null;
  activeEventIndex: number; // to sync with playback
}

export const UnitIntelligenceSummary: React.FC<UnitIntelligenceSummaryProps> = ({ 
  unit, 
  verificationResult,
  activeEventIndex
}) => {
  // Use a derived state of the unit based on activeEventIndex for the playback
  // The event at activeEventIndex determines our simulated "current" state
  const activeEvent = unit.events[activeEventIndex];
  
  // We need to map event type to unit current state for the integration helpers
  let simulatedState = unit.currentState;
  if (activeEvent) {
    if (activeEvent.event === 'COLLECTION') simulatedState = 'COLLECTED';
    if (activeEvent.event === 'PROCESSING') simulatedState = 'PROCESSING';
    if (activeEvent.event === 'STORAGE') simulatedState = 'STORED';
    if (activeEvent.event === 'ALLOCATED') simulatedState = 'ALLOCATED';
    if (activeEvent.event === 'DISPATCH') simulatedState = 'DISPATCHED';
    if (activeEvent.event === 'TRANSIT UPDATE') simulatedState = 'IN TRANSIT';
    if (activeEvent.event === 'ARRIVED') simulatedState = 'ARRIVED';
  }
  
  // Create a synthetic unit for the integration layer
  const syntheticUnit = { ...unit, currentState: simulatedState };

  const expiry = getUnitExpiryContext(syntheticUnit);
  const coldChain = getUnitColdChainContext(syntheticUnit);
  const route = getUnitRouteContext(syntheticUnit);
  const allocation = getUnitAllocationContext(syntheticUnit);

  const isInvalid = verificationResult?.valid === false && activeEventIndex >= (verificationResult.firstMismatchIndex ?? 0);

  return (
    <div className="bg-ink-900 border border-ink-800 rounded-2xl shadow-sm overflow-hidden p-6 text-white relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blood-900/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">UNIT INTELLIGENCE</div>
          <div className="font-mono text-xl font-bold tracking-tight text-white">{unit.id}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">CURRENT STATE</div>
          <div className="text-lg font-bold tracking-widest uppercase text-blood-400">{simulatedState}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
        
        {/* Expiry */}
        <div>
          <div className="text-[10px] text-ink-500 uppercase tracking-widest mb-1">EXPIRY</div>
          <div className="text-sm font-bold text-white mb-1">{unit.expiryDate}</div>
          <div className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded inline-block ${
            expiry.riskLevel === 'HIGH' ? 'bg-blood-900/50 text-blood-400' : 
            expiry.riskLevel === 'WATCH' ? 'bg-amber-900/50 text-amber-400' : 'bg-emerald-900/50 text-emerald-400'
          }`}>
            RISK {expiry.riskLevel}
          </div>
        </div>

        {/* Route */}
        <div>
          <div className="text-[10px] text-ink-500 uppercase tracking-widest mb-1">ROUTE FIT</div>
          {route ? (
            <>
              <div className="text-sm font-bold text-white mb-1">{route.routeFit} / 100</div>
              <div className="text-[9px] font-bold tracking-widest uppercase text-ink-400">{route.status}</div>
            </>
          ) : (
            <div className="text-[9px] font-bold tracking-widest uppercase text-ink-600 mt-2">NOT LINKED</div>
          )}
        </div>

        {/* Sentinel */}
        <div>
          <div className="text-[10px] text-ink-500 uppercase tracking-widest mb-1">SENTINEL</div>
          {coldChain ? (
            <>
              <div className="text-sm font-bold text-white mb-1">{coldChain.sentinelRisk} / 100</div>
              <div className="text-[9px] font-bold tracking-widest uppercase text-ink-400">{coldChain.status}</div>
            </>
          ) : (
            <div className="text-[9px] font-bold tracking-widest uppercase text-ink-600 mt-2">NOT LINKED</div>
          )}
        </div>
        
        {/* Allocation */}
        <div>
          <div className="text-[10px] text-ink-500 uppercase tracking-widest mb-1">ALLOCATION</div>
          <div className="text-sm font-bold text-white mb-1">{allocation?.status || 'NOT ALLOCATED'}</div>
          {allocation && allocation.status !== 'NOT ALLOCATED' && (
            <div className="text-[9px] font-bold tracking-widest uppercase text-ink-400 truncate" title={allocation.destination}>
              {allocation.destination}
            </div>
          )}
        </div>
        
        {/* Ledger Integrity */}
        <div>
          <div className="text-[10px] text-ink-500 uppercase tracking-widest mb-1">LEDGER</div>
          <div className="flex items-center gap-2 mb-1">
            {isInvalid ? (
               <AlertTriangle className="w-4 h-4 text-amber-500" />
            ) : verificationResult ? (
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
            ) : (
               <div className="w-4 h-4 rounded-full border border-ink-600 border-dashed" />
            )}
            <span className={`text-sm font-bold ${isInvalid ? 'text-amber-500' : verificationResult ? 'text-emerald-500' : 'text-ink-400'}`}>
              {isInvalid ? 'MISMATCH' : verificationResult ? 'VERIFIED' : 'UNVERIFIED'}
            </span>
          </div>
          <div className="text-[9px] font-bold tracking-widest uppercase text-ink-400">INTEGRITY STATUS</div>
        </div>

      </div>
    </div>
  );
};
