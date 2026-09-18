import React, { useState } from 'react';
import type { AllocationPlan, BloodRequest, NetworkSupply } from '../negotiatorData';
import { ChevronRight, ShieldCheck, AlertTriangle } from 'lucide-react';

interface NegotiationInsightProps {
  allocation: AllocationPlan | null;
  requests: BloodRequest[];
  supply: NetworkSupply;
}

export const NegotiationInsight: React.FC<NegotiationInsightProps> = ({ allocation, requests, supply }) => {
  const [showWhy, setShowWhy] = useState(false);
  const [approved, setApproved] = useState(false);

  if (!allocation) return null;

  return (
    <div className="bg-white border border-ink-200/40 rounded shadow-sm flex flex-col h-full animate-fade-in">
      <div className="p-4 border-b border-ink-200/40 bg-paper/50">
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">Network Plan Generated</h3>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        
        {/* Summary */}
        <div className="mb-6">
          <p className="text-sm text-ink-900 leading-relaxed mb-4">
            Recommendation generated using prototype logistics allocation rules to balance urgency and network reserve.
          </p>
          
          {!allocation.reserveProtected && (
            <div className="bg-blood-50 border border-blood-200 rounded p-3 mb-4 flex items-start gap-2">
               <AlertTriangle className="text-blood-600 mt-0.5 shrink-0" size={16} />
               <div>
                 <div className="text-xs font-bold text-blood-900 uppercase tracking-widest mb-1">Reserve Constraint Breached</div>
                 <div className="text-xs text-blood-800/90 leading-relaxed">
                   Available stock is insufficient to satisfy all requests while maintaining the configured reserve. Alternative supply review required.
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Decision DNA / Why */}
        <div className="mb-6">
           {showWhy ? (
             <div className="animate-fade-in bg-ink-50 p-3 rounded border border-ink-100">
               <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-3">Decision Factors</div>
               <div className="space-y-4">
                 {allocation.allocations.map(a => {
                   const req = requests.find(r => r.id === a.requestId);
                   return (
                     <div key={a.requestId}>
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-xs font-bold text-ink-900">{req?.facilityName}</span>
                         <span className="text-[10px] font-mono text-ink-500 font-bold">{a.priorityScore}/100</span>
                       </div>
                       <ul className="space-y-1">
                         {a.reasons.map((r, i) => (
                           <li key={i} className="text-[10px] text-ink-600 flex items-start gap-1">
                             <span className="text-blood-500 mt-0.5">•</span> {r}
                           </li>
                         ))}
                       </ul>
                     </div>
                   );
                 })}
               </div>
               
               <div className="mt-4 pt-3 border-t border-ink-200">
                 <div className="text-xs text-ink-600 leading-relaxed">
                   <strong>Network Constraint:</strong> Only {supply.allocatableUnits} units are available for allocation while {supply.reserveUnits} units are reserved.
                 </div>
               </div>
               
               <button onClick={() => setShowWhy(false)} className="mt-4 text-[10px] font-bold text-ink-400 hover:text-ink-900 transition-colors uppercase tracking-widest">
                 Close Reasoning
               </button>
             </div>
           ) : (
             <button 
               onClick={() => setShowWhy(true)}
               className="w-full flex items-center justify-between text-xs font-bold text-ink-600 hover:text-ink-900 transition-colors uppercase tracking-widest p-3 bg-ink-50 rounded border border-ink-100"
             >
               Why did BloodChain allocate this way? <ChevronRight size={14} />
             </button>
           )}
        </div>

        <div className="mt-auto">
          {approved ? (
            <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
              <ShieldCheck className="text-green-600 mx-auto mb-2" size={24} />
              <div className="text-xs font-bold text-green-900 uppercase tracking-widest">Plan Approved</div>
              <div className="text-[10px] text-green-700 mt-1">Marked as reviewed in demo mode.</div>
            </div>
          ) : (
            <>
              <div className="text-center mb-3">
                <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-1">AI-Generated Logistics Plan</div>
                <div className="text-[10px] text-ink-500">Requires authorized human review.</div>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setApproved(true)}
                  className="w-full py-3 bg-ink-900 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-ink-800 transition-colors"
                >
                  Approve For Workflow
                </button>
                <button className="w-full py-3 border border-ink-200 text-ink-600 text-xs font-bold uppercase tracking-widest rounded hover:bg-ink-50 transition-colors">
                  Adjust Plan
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
