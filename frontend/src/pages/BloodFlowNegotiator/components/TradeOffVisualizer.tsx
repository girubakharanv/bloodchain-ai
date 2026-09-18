import React from 'react';
import type { AllocationPlan } from '../negotiatorData';
import { GitCompare } from 'lucide-react';

interface TradeOffVisualizerProps {
  allocation: AllocationPlan | null;
}

export const TradeOffVisualizer: React.FC<TradeOffVisualizerProps> = ({ allocation }) => {
  if (!allocation) return null;

  return (
    <div className="bg-white border border-ink-200/40 rounded shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-ink-200/40 bg-paper/50 flex justify-between items-center">
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest flex items-center gap-2">
          <GitCompare size={16} className="text-ink-500" /> The Trade-Off
        </h3>
      </div>
      
      <div className="p-4 flex-1 grid grid-cols-2 divide-x divide-ink-100">
        
        {/* OPTION A: First Come First Served */}
        <div className="pr-4 flex flex-col">
          <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-4">Option A: Unbalanced</div>
          
          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-600">Hospital A</span>
              <span className="font-bold text-green-700">Low Risk</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-600">Hospital B</span>
              <span className="font-bold text-blood-700">High Risk</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-600">Hospital C</span>
              <span className="font-bold text-blood-700">High Risk</span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-ink-100">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">Network Balance</span>
              <span className="text-lg font-mono font-bold text-orange-600">58</span>
            </div>
          </div>
        </div>

        {/* OPTION B: Optimized */}
        <div className="pl-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[10px] font-bold text-blood-700 uppercase tracking-widest">Option B: Recommended</div>
            <div className="w-1.5 h-1.5 rounded-full bg-blood-600 animate-pulse" />
          </div>
          
          <div className="space-y-3 flex-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-600">Hospital A</span>
              <span className="font-bold text-orange-600">Moderate Risk</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-600">Hospital B</span>
              <span className="font-bold text-orange-600">Moderate Risk</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-600">Hospital C</span>
              <span className="font-bold text-green-700">Low Risk</span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-ink-100">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">Network Balance</span>
              <span className="text-lg font-mono font-bold text-green-700">{allocation.networkBalanceScore}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
