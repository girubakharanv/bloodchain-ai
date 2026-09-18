import React from 'react';
import { Shipment } from '../../../data/coldChainData';
import { Box, Lock, Truck, Thermometer, MapPin } from 'lucide-react';

interface ChainTimelineProps {
  shipment: Shipment;
}

export const ChainTimeline: React.FC<ChainTimelineProps> = ({ shipment }) => {
  const { chainTimeline } = shipment;

  if (!chainTimeline || chainTimeline.length === 0) {
    return (
      <div className="bg-white border border-ink-200/50 rounded-2xl shadow-sm h-full flex flex-col">
        <div className="px-6 py-4 border-b border-ink-100 bg-ink-50/50">
          <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">Chain of Custody</h3>
        </div>
        <div className="p-6 flex items-center justify-center flex-grow text-ink-400 italic text-sm">
          No timeline events recorded.
        </div>
      </div>
    );
  }

  const getIconForEvent = (eventText: string) => {
    const lower = eventText.toLowerCase();
    if (lower.includes('loaded')) return <Box className="w-4 h-4 text-ink-600" />;
    if (lower.includes('sealed')) return <Lock className="w-4 h-4 text-ink-600" />;
    if (lower.includes('dispatched')) return <Truck className="w-4 h-4 text-blood-600" />;
    if (lower.includes('temperature')) return <Thermometer className="w-4 h-4 text-ink-600" />;
    if (lower.includes('route')) return <MapPin className="w-4 h-4 text-ink-600" />;
    return <div className="w-2 h-2 rounded-full bg-ink-400 m-1" />;
  };

  return (
    <div className="bg-white border border-ink-200/50 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-ink-100 bg-ink-50/50">
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">Chain of Custody</h3>
      </div>
      
      <div className="p-6 flex-grow overflow-y-auto">
        <div className="relative border-l border-ink-200 ml-3 space-y-6">
          {chainTimeline.map((item, idx) => (
            <div key={idx} className="relative pl-6">
              {/* Timeline Node */}
              <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center ${
                idx === chainTimeline.length - 1 ? 'bg-ink-100 ring-2 ring-ink-100' : 'bg-ink-50'
              }`}>
                {getIconForEvent(item.event)}
              </div>
              
              {/* Event Content */}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-ink-900 leading-tight">{item.event}</span>
                <span className="text-[10px] text-ink-500 font-medium mt-0.5">{item.time}</span>
              </div>
            </div>
          ))}
          
          {/* Pending Final Node (e.g. ARRIVING) */}
          <div className="relative pl-6 opacity-40">
             <div className="absolute -left-3.5 top-0 w-7 h-7 rounded-full border-2 border-white bg-ink-50 flex items-center justify-center border-dashed">
                <div className="w-2 h-2 rounded-full bg-ink-300 m-1" />
             </div>
             <div className="flex flex-col">
                <span className="text-xs font-bold text-ink-900 leading-tight italic">Arriving (Pending)</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
