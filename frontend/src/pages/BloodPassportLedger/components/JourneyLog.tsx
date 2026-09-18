import React from 'react';
import { BloodUnit } from '../data/bloodPassportData';
import { ScrollText, CheckCircle2 } from 'lucide-react';

interface JourneyLogProps {
  unit: BloodUnit;
  activeEventIndex: number;
}

export const JourneyLog: React.FC<JourneyLogProps> = ({ unit, activeEventIndex }) => {
  return (
    <div className="bg-white border border-ink-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-ink-200 flex items-center gap-2 bg-ink-50/50">
        <ScrollText className="w-4 h-4 text-ink-400" />
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-widest">
          JOURNEY LOG
        </h3>
      </div>
      
      <div className="p-6 flex-grow overflow-y-auto">
        <div className="space-y-4">
          {unit.events.slice(0, activeEventIndex + 1).map((event, idx) => {
            const isLast = idx === activeEventIndex;
            
            return (
              <div 
                key={event.id} 
                className={`flex gap-4 p-3 rounded-lg border ${
                  isLast ? 'border-blood-200 bg-blood-50' : 'border-ink-100 bg-white opacity-60 hover:opacity-100 transition-opacity'
                }`}
              >
                <div className="text-right w-12 flex-shrink-0">
                  <div className={`font-mono text-xs font-bold ${isLast ? 'text-blood-600' : 'text-ink-500'}`}>
                    {event.timestamp}
                  </div>
                </div>
                
                <div className="border-l-2 border-ink-200 pl-4 relative">
                  <div className={`absolute top-1 -left-[5px] w-2 h-2 rounded-full ${isLast ? 'bg-blood-500' : 'bg-ink-300'}`} />
                  
                  <div className={`text-sm font-bold uppercase tracking-widest mb-1 ${isLast ? 'text-ink-900' : 'text-ink-700'}`}>
                    {event.event}
                  </div>
                  
                  <div className="text-xs text-ink-600">
                    {event.location}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {activeEventIndex === unit.events.length - 1 && (
          <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600 border border-emerald-200 bg-emerald-50 rounded-lg p-3">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Journey Complete</span>
          </div>
        )}
      </div>
    </div>
  );
};
