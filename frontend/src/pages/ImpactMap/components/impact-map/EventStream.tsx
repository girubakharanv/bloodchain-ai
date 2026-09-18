import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { SimulationEvent } from '../../utils/impactMapSimulationController';

interface EventStreamProps {
  events: SimulationEvent[];
}

export const EventStream: React.FC<EventStreamProps> = ({ events }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="bg-ink-950 border border-ink-900 rounded-xl p-4 shadow-sm animate-fade-in h-48 flex flex-col">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-ink-800">
        <div className="flex items-center gap-2 text-[10px] font-bold text-ink-500 uppercase tracking-widest">
          <Terminal className="w-4 h-4" /> SIMULATION EVENT STREAM
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
          <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">SIMULATION MODE</span>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-1 pr-2 custom-scrollbar">
        {events.length === 0 ? (
          <div className="text-xs text-ink-600 font-mono italic">Awaiting simulation events...</div>
        ) : (
          events.slice().reverse().map((ev, idx) => (
            <div key={idx} className="text-xs font-mono flex items-start gap-3 animate-fade-in">
              <span className="text-ink-500 flex-shrink-0">{ev.time}</span>
              <span className="text-emerald-400">{ev.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
