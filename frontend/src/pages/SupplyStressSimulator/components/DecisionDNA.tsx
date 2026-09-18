import React from 'react';
import { Cpu, Zap, ArrowUp } from 'lucide-react';

interface DecisionDNAProps {
  decisionDNA: { title: string; contributors: Record<string, number>; reason: string };
  isStressed: boolean;
}

export const DecisionDNA: React.FC<DecisionDNAProps> = ({ decisionDNA, isStressed }) => {
  return (
    <div className={`bg-ink-900 border ${isStressed ? 'border-amber-500/50' : 'border-ink-800'} rounded-2xl shadow-sm overflow-hidden h-full flex flex-col relative transition-colors duration-500`}>
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none transition-colors duration-1000 ${
        isStressed ? 'bg-amber-600/10' : 'bg-emerald-600/5'
      }`} />
      
      <div className="px-6 py-4 border-b border-ink-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isStressed ? (
            <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
          ) : (
            <Cpu className="w-4 h-4 text-ink-400" />
          )}
          <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider">
            {decisionDNA.title}
          </h3>
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col relative z-10 overflow-y-auto">
        
        {isStressed ? (
           <div className="animate-fade-in flex flex-col h-full">
             <div className="mb-6">
                <h4 className="text-[10px] font-bold text-amber-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                  Simulation Contributors
                </h4>
                
                <div className="space-y-4">
                  {Object.entries(decisionDNA.contributors).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-ink-300 flex items-center gap-2">{key}</span>
                      <div className="flex items-center gap-2">
                         <span className="font-mono text-xs text-amber-400">+{val}</span>
                         <ArrowUp className="w-3.5 h-3.5 text-blood-500" />
                      </div>
                    </div>
                  ))}
                </div>
             </div>
             
             <div className="mt-auto pt-4 border-t border-ink-800">
                <p className="text-sm italic leading-relaxed border-l-2 pl-3 text-amber-200/80 border-amber-500/50">
                  "{decisionDNA.reason}"
                </p>
             </div>
           </div>
        ) : (
           <div className="flex flex-col items-center justify-center h-full text-center">
             <div className="w-12 h-12 rounded-full bg-ink-800 flex items-center justify-center mb-4">
               <Cpu className="w-6 h-6 text-ink-500" />
             </div>
             <p className="text-ink-400 text-sm max-w-xs italic">
               "{decisionDNA.reason}"
             </p>
           </div>
        )}

      </div>
    </div>
  );
};
