import React, { useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';
import { EventStreamLog } from '../utils/stressScenarioRunner';

interface LiveEventStreamProps {
  events: EventStreamLog[];
}

export const LiveEventStream: React.FC<LiveEventStreamProps> = ({ events }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="bg-ink-900 border border-ink-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-ink-800/50 flex items-center gap-2">
        <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
        <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider">
          Stress Event Stream
        </h3>
      </div>
      
      <div 
        ref={containerRef}
        className="p-6 flex-grow flex flex-col gap-3 overflow-y-auto font-mono text-sm"
      >
        {events.length === 0 ? (
          <div className="text-center text-ink-600 italic py-8">
            Waiting for simulation to begin...
          </div>
        ) : (
          events.map((event, idx) => (
            <div 
              key={event.id} 
              className={`flex gap-4 animate-fade-in ${idx === events.length - 1 ? 'text-amber-400' : 'text-ink-400'}`}
            >
              <div className="flex-shrink-0 text-xs opacity-70">
                {event.timestamp}
              </div>
              <div className="flex-grow tracking-wide">
                {event.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
