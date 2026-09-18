import React, { useState, useEffect } from 'react';
import { BloodFlowVisualizer } from './components/BloodFlowVisualizer';
import { NetworkRequestBoard } from './components/NetworkRequestBoard';
import { WhatIfControls } from './components/WhatIfControls';
import { NegotiationInsight } from './components/NegotiationInsight';
import { TradeOffVisualizer } from './components/TradeOffVisualizer';
import { demoRequests, demoSupply, defaultWeights } from './negotiatorData';
import type { BloodRequest, NetworkSupply, AllocationPlan } from './negotiatorData';
import { generateAllocationPlan } from './allocationEngine';

export const BloodFlowNegotiator: React.FC = () => {
  const [mode, setMode] = useState<'conflict' | 'negotiating' | 'allocated'>('conflict');
  const [supply, setSupply] = useState<NetworkSupply>(demoSupply);
  const [requests, setRequests] = useState<BloodRequest[]>(demoRequests);
  const [allocation, setAllocation] = useState<AllocationPlan | null>(null);

  const handleNegotiate = () => {
    setMode('negotiating');
    // Simulate thinking/negotiation delay for visual wow factor
    setTimeout(() => {
      const result = generateAllocationPlan(requests, supply, defaultWeights);
      setAllocation(result);
      setMode('allocated');
    }, 2000);
  };

  const reset = () => {
    setMode('conflict');
    setAllocation(null);
    setSupply(demoSupply);
    setRequests(demoRequests);
  };

  // Immediate recalculation for What-If
  useEffect(() => {
    if (mode === 'allocated') {
      const result = generateAllocationPlan(requests, supply, defaultWeights);
      setAllocation(result);
    }
  }, [supply, requests, mode]);

  const handleAdjustSupply = (amount: number) => {
    setSupply(prev => ({
      ...prev,
      totalAvailable: prev.totalAvailable + amount,
      allocatableUnits: prev.allocatableUnits + amount
    }));
  };

  const handleAdjustDemand = (facilityId: string, amount: number) => {
    setRequests(prev => prev.map(req => 
      req.facilityId === facilityId 
        ? { ...req, requestedUnits: req.requestedUnits + amount }
        : req
    ));
  };

  const totalRequested = requests.reduce((sum, req) => sum + req.requestedUnits, 0);

  return (
    <div className="flex h-full w-full bg-paper">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-8 border-b border-ink-200/40 shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-blood-800/10 text-blood-800 text-[10px] font-bold tracking-widest uppercase rounded">03 / BloodFlow Negotiator™</span>
                <span className="px-2 py-0.5 bg-ink-200 text-ink-700 text-[10px] font-bold tracking-widest uppercase rounded">Simulated Network</span>
              </div>
              <h1 className="font-editorial text-4xl font-bold text-ink-900 leading-tight mb-2">When every request matters,<br />the network must decide.</h1>
              <p className="text-ink-600">Coordinate limited supply across competing requests without losing sight of urgency, reserve and logistics.</p>
            </div>
            
            <div className="flex flex-col items-end justify-center h-full">
              {mode === 'conflict' ? (
                <button 
                  onClick={handleNegotiate}
                  className="primary-btn px-8 py-3 text-sm font-bold uppercase tracking-widest"
                >
                  Negotiate Network
                </button>
              ) : (
                <button 
                  onClick={reset}
                  className="text-xs font-bold text-ink-500 uppercase tracking-widest hover:text-ink-900 transition-colors"
                >
                  Reset Prototype
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Main Visualizer Area */}
          <div className="flex gap-8 h-[400px]">
            <div className="flex-1">
              <BloodFlowVisualizer 
                mode={mode} 
                supply={supply} 
                requests={requests} 
                allocation={allocation} 
              />
            </div>
            
            <div className="w-[360px] shrink-0">
              {mode === 'conflict' ? (
                <div className="bg-white border border-ink-200/40 rounded shadow-sm h-full p-6 flex flex-col justify-center items-center text-center">
                   <div className="text-4xl font-editorial font-bold text-ink-900 mb-2">{totalRequested}</div>
                   <div className="text-xs font-bold text-ink-500 uppercase tracking-widest mb-6">Total Units Requested</div>
                   
                   <div className="w-12 h-[1px] bg-ink-200 mb-6" />

                   <div className="text-4xl font-editorial font-bold text-blood-700 mb-2">{supply.allocatableUnits}</div>
                   <div className="text-xs font-bold text-ink-500 uppercase tracking-widest mb-2">Total Allocatable Units</div>
                   <div className="text-[10px] text-ink-400">({supply.totalAvailable} Available − {supply.reserveUnits} Reserved)</div>

                   <div className="mt-8 text-sm text-ink-700 font-medium">
                     Supply constraint identified.<br/>Awaiting network negotiation.
                   </div>
                </div>
              ) : (
                <NegotiationInsight 
                  allocation={allocation} 
                  requests={requests} 
                  supply={supply} 
                />
              )}
            </div>
          </div>

          {/* Network Board Area */}
          <div className="grid grid-cols-[1fr_360px] gap-8">
             <div className="space-y-8">
               <NetworkRequestBoard 
                 requests={requests}
                 allocation={allocation}
                 mode={mode}
               />
               
               {mode === 'allocated' && (
                 <TradeOffVisualizer allocation={allocation} />
               )}
             </div>

             <div>
               <WhatIfControls 
                 onAdjustSupply={handleAdjustSupply}
                 onAdjustDemand={handleAdjustDemand}
               />
             </div>
          </div>

          {/* Footer Area */}
          <div className="text-center py-16 border-t border-ink-100">
            <h2 className="text-3xl font-editorial font-bold text-ink-900 mb-2">The network sees<br/>more than a single request.</h2>
            <p className="text-sm text-ink-600 mb-4">BloodChain AI evaluates the consequence of every allocation across the connected network.</p>
            <div className="flex justify-center gap-6 text-[10px] font-bold text-blood-600 tracking-[0.2em] mt-8">
              <span>PRIORITIZE</span>
              <span>•</span>
              <span>BALANCE</span>
              <span>•</span>
              <span>PRESERVE</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
