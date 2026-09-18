import React from 'react';
import { HelpCircle } from 'lucide-react';

interface WhatIfControlsProps {
  onAdjustSupply: (amount: number) => void;
  onAdjustDemand: (facilityId: string, amount: number) => void;
}

export const WhatIfControls: React.FC<WhatIfControlsProps> = ({ onAdjustSupply, onAdjustDemand }) => {
  return (
    <div className="bg-white border border-ink-200/40 rounded shadow-sm flex flex-col h-full">
      <div className="p-4 border-b border-ink-200/40 bg-paper/50 flex items-center gap-2">
        <HelpCircle size={16} className="text-ink-500" />
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">What If?</h3>
      </div>
      
      <div className="p-4 space-y-6">
        <div>
          <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-2">Network Supply</div>
          <div className="flex gap-2">
            <button 
              onClick={() => onAdjustSupply(10)}
              className="flex-1 py-2 px-3 border border-ink-200 rounded text-xs font-bold text-ink-700 hover:bg-ink-50 transition-colors"
            >
              +10 Available
            </button>
            <button 
              onClick={() => onAdjustSupply(-10)}
              className="flex-1 py-2 px-3 border border-ink-200 rounded text-xs font-bold text-ink-700 hover:bg-ink-50 transition-colors"
            >
              −10 Available
            </button>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-2">Hospital Requests</div>
          <div className="space-y-2">
             <button 
               onClick={() => onAdjustDemand('hosp-a', 5)}
               className="w-full text-left py-2 px-3 border border-ink-200 rounded text-xs font-bold text-ink-700 hover:bg-ink-50 transition-colors flex justify-between"
             >
               <span>Hospital A</span>
               <span className="text-orange-600">+5 units</span>
             </button>
             <button 
               onClick={() => onAdjustDemand('hosp-b', 5)}
               className="w-full text-left py-2 px-3 border border-ink-200 rounded text-xs font-bold text-ink-700 hover:bg-ink-50 transition-colors flex justify-between"
             >
               <span>Hospital B</span>
               <span className="text-orange-600">+5 units</span>
             </button>
             <button 
               onClick={() => onAdjustDemand('hosp-c', 5)}
               className="w-full text-left py-2 px-3 border border-ink-200 rounded text-xs font-bold text-ink-700 hover:bg-ink-50 transition-colors flex justify-between"
             >
               <span>Hospital C</span>
               <span className="text-orange-600">+5 units</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
