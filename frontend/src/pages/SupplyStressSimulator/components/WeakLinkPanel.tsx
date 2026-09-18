import React from 'react';
import { Unlink } from 'lucide-react';

interface WeakLinkPanelProps {
  weakestLink: { name: string; impact: string; reason: string } | null;
}

export const WeakLinkPanel: React.FC<WeakLinkPanelProps> = ({ weakestLink }) => {
  return (
    <div className="bg-ink-900 border border-ink-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blood-900/40 via-transparent to-transparent pointer-events-none" />
      
      <div className="px-6 py-4 border-b border-ink-800/50 flex items-center gap-2">
        <Unlink className="w-4 h-4 text-blood-500" />
        <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider">
          Weakest Network Links
        </h3>
      </div>
      
      <div className="p-6 flex-grow flex flex-col justify-center">
        {!weakestLink ? (
          <div className="text-center text-ink-500 text-sm italic">
            Network is robust. No critical weak links identified.
          </div>
        ) : (
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-ink-500 mb-2">Primary Vulnerability</div>
            <div className="text-2xl font-editorial font-bold text-white mb-6">
              {weakestLink.name}
            </div>
            
            <div className="mb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-ink-500 mr-3">Impact Level</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                weakestLink.impact === 'CRITICAL' ? 'bg-blood-900/80 text-blood-400 border border-blood-800' :
                'bg-amber-900/80 text-amber-500 border border-amber-800'
              }`}>
                {weakestLink.impact}
              </span>
            </div>
            
            <div className="mt-6 pt-4 border-t border-ink-800">
               <p className="text-sm text-ink-400 italic leading-relaxed border-l-2 border-blood-600 pl-3">
                 "{weakestLink.reason}"
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
