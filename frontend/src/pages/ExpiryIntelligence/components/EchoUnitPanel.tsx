import React, { useState } from 'react';
import type { BloodUnit } from '../../../data/bloodUnits';
import { Network, Activity, AlertTriangle, ShieldCheck, ChevronRight, CornerDownRight } from 'lucide-react';

interface EchoUnitPanelProps {
  unitId: string;
  units: (BloodUnit & { simulatedRisk: number; simulatedUtilization: string })[];
  onClose: () => void;
}

export const EchoUnitPanel: React.FC<EchoUnitPanelProps> = ({ unitId, units, onClose }) => {
  const [showNetwork, setShowNetwork] = useState(false);
  const [showDna, setShowDna] = useState(false);
  
  const unit = units.find(u => u.id === unitId);
  if (!unit) return null;

  const isHighRisk = unit.simulatedRisk > 80;

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-6 border-b border-ink-200/40 flex justify-between items-start bg-paper sticky top-0 z-10">
        <div>
          <span className="text-xs font-bold tracking-widest text-ink-400 uppercase mb-1 block">Unit Echo Intelligence</span>
          <h2 className="text-2xl font-editorial font-bold text-ink-900">{unit.id}</h2>
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-1 bg-blood-100 text-blood-800 text-xs font-bold rounded">{unit.bloodGroup}</span>
            <span className="px-2 py-1 bg-ink-100 text-ink-600 text-xs font-medium rounded">{unit.component}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-ink-400 hover:text-ink-900 transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* The Echo Concept - Vertical Timeline */}
        <div>
          <h3 className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-4">Lifecycle Echo</h3>
          <div className="relative pl-4 border-l-2 border-ink-200 space-y-6">
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-ink-300 border-2 border-white" />
              <div className="text-xs font-bold text-ink-400">DONATED & STORED</div>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blood-500 border-2 border-white animate-pulse" />
              <div className="text-xs font-bold text-ink-900">CURRENT STATE</div>
              <div className="text-xl font-editorial font-bold text-blood-700 mt-1">{unit.hoursRemaining} HOURS REMAINING</div>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-orange-400 border-2 border-white" />
              <div className="text-xs font-bold text-ink-900 uppercase">PREDICTED FUTURE</div>
              <div className="text-sm text-ink-600 mt-1">{unit.simulatedUtilization} Expected Local Utilization</div>
              {unit.rescueOpportunityScore > 75 && (
                <div className="text-sm text-blood-600 font-bold mt-1 flex items-center gap-1">
                  <CornerDownRight size={14} /> Potential Rescue Window
                </div>
              )}
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-ink-900 border-2 border-white" />
              <div className="text-xs font-bold text-ink-400">EXPIRY</div>
            </div>
          </div>
        </div>

        <hr className="border-ink-200/40" />

        {/* Intelligence Breakdown */}
        <div className="space-y-6">
          <div>
            <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-1">Expiry Risk Score</div>
            <div className="flex items-end gap-2">
              <span className={`text-4xl font-editorial font-bold ${isHighRisk ? 'text-blood-700' : 'text-orange-600'}`}>{Math.round(unit.simulatedRisk)}</span>
              <span className="text-ink-400 mb-1">/ 100</span>
            </div>
            <div className="w-full h-1.5 bg-ink-100 rounded-full mt-2 overflow-hidden">
               <div className={`h-full ${isHighRisk ? 'bg-blood-600' : 'bg-orange-500'}`} style={{ width: `${unit.simulatedRisk}%` }} />
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-1">Network Signal</div>
            <p className="text-sm text-ink-700">
              {unit.predictedDemandNearby > 0 
                ? `${unit.predictedDemandNearby} nearby facilities may require ${unit.bloodGroup} units within the forecast window.`
                : `No immediate external demand detected for ${unit.bloodGroup} in local radius.`}
            </p>
          </div>

          <div>
            <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-1">Potential Rescue</div>
            <p className="text-sm text-ink-700">
              {unit.rescueOpportunityScore > 75 
                ? 'Suitable stock may warrant authorized redistribution review.'
                : 'Current logistics window or demand does not meet rescue threshold.'}
            </p>
          </div>
        </div>

        <hr className="border-ink-200/40" />

        {/* Forecast Chart Placeholder */}
        <div>
           <div className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-4">Current Stock vs Forecasted Utilization</div>
           <div className="h-32 bg-ink-50 rounded-lg border border-ink-200 flex items-center justify-center relative overflow-hidden">
              <Activity className="absolute text-ink-200 w-full h-full opacity-20 scale-150" />
              <span className="text-[10px] font-mono text-ink-400 z-10">[ Predictive Chart Rendering ]</span>
           </div>
        </div>

        <hr className="border-ink-200/40" />

        {/* Network Rescue View */}
        {showNetwork ? (
          <div className="bg-ink-900 text-white p-4 rounded-lg">
            <h4 className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-4">Simulated Network</h4>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                <span>Current Facility</span>
                <span className="text-blood-400">{unit.bloodGroup} Surplus</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-ink-500">
                 <div className="w-px h-6 bg-dashed border-l border-ink-500" />
                 <span className="text-[10px]">12 km / 24 mins</span>
                 <div className="w-px h-6 bg-dashed border-l border-ink-500" />
              </div>
              <div className="flex justify-between items-center text-sm border-t border-white/10 pt-2">
                <span>Hospital Alpha</span>
                <span className="text-green-400">Predicted Demand</span>
              </div>
            </div>
            <button onClick={() => setShowNetwork(false)} className="mt-4 text-[10px] uppercase tracking-wider text-ink-400 hover:text-white">Close Map</button>
          </div>
        ) : (
          <button 
            onClick={() => setShowNetwork(true)}
            className="w-full py-3 px-4 border border-ink-200 rounded-md text-sm font-bold text-ink-700 hover:bg-ink-50 transition-colors flex items-center justify-center gap-2"
          >
            <Network size={16} /> Reveal Rescue Opportunities
          </button>
        )}

        <div className="bg-blood-50 border border-blood-100 rounded-lg p-4">
           <div className="flex items-start gap-3">
             <ShieldCheck className="text-blood-700 mt-0.5 shrink-0" size={18} />
             <div>
               <h4 className="text-sm font-bold text-blood-900 mb-1">Recommended Review</h4>
               <p className="text-xs text-blood-800/80 mb-3">Review this unit for an approved redistribution opportunity.</p>
               <p className="text-[9px] uppercase tracking-wider text-blood-600/60 font-bold border-t border-blood-200 pt-2">
                 Subject to authorized blood-bank and clinical procedures.
               </p>
             </div>
           </div>
        </div>

        {/* Decision DNA */}
        {showDna ? (
          <div className="bg-paper border border-ink-200 rounded-lg p-4">
            <h4 className="text-xs font-bold text-ink-900 mb-3">Why did BloodChain flag this?</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-ink-100 pb-1">
                <span className="text-ink-600">Time remaining</span>
                <span className="font-bold text-blood-700">HIGH IMPACT</span>
              </div>
              <div className="flex justify-between border-b border-ink-100 pb-1">
                <span className="text-ink-600">Predicted utilization</span>
                <span className="font-bold text-blood-700">HIGH IMPACT</span>
              </div>
              <div className="flex justify-between border-b border-ink-100 pb-1">
                <span className="text-ink-600">Network demand</span>
                <span className="font-bold text-orange-600">MED IMPACT</span>
              </div>
              <div className="flex justify-between border-b border-ink-100 pb-1">
                <span className="text-ink-600">Logistics feasibility</span>
                <span className="font-bold text-orange-600">MED IMPACT</span>
              </div>
            </div>
            <p className="text-[10px] text-ink-400 mt-3 italic">Recommendation generated from prototype logistics-risk rules.</p>
            <button onClick={() => setShowDna(false)} className="mt-2 text-[10px] font-bold text-ink-500">Close Reasoning</button>
          </div>
        ) : (
          <button 
            onClick={() => setShowDna(true)}
            className="text-xs font-bold text-ink-500 hover:text-ink-900 uppercase tracking-widest flex items-center justify-center w-full"
          >
            Why did BloodChain flag this?
          </button>
        )}
        
      </div>
    </div>
  );
};
