import React from 'react';
import { Clock } from 'lucide-react';
import { TimelineEvent } from '../../types/impactMap';

interface ImpactTimelineProps {
  timeline: TimelineEvent[];
}

export const ImpactTimeline: React.FC<ImpactTimelineProps> = ({ timeline }) => {
  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-8 shadow-sm h-full animate-fade-in">
      <div className="flex items-center gap-2 mb-8 border-b border-ink-100 pb-4">
        <Clock className="w-5 h-5 text-ink-400" />
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">
          NETWORK IMPACT TIMELINE
        </h3>
      </div>
      
      <div className="relative pl-4">
        {/* Vertical Line */}
        <div className="absolute top-2 bottom-2 left-[5px] w-0.5 bg-ink-100" />
        
        <div className="space-y-6">
          {timeline.map((event, idx) => (
            <div key={idx} className="relative flex items-start gap-4">
              {/* Node Dot */}
              <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-blood-500 z-10" />
              
              <div className="w-16 flex-shrink-0 pt-0.5">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  idx === 0 ? 'text-blood-600 bg-blood-50 px-2 py-1 rounded' : 'text-ink-500'
                }`}>
                  {event.timeOffset}
                </span>
              </div>
              
              <div className="text-sm font-medium text-ink-700 pt-0.5">
                {event.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
