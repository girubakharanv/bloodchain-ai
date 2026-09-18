import React from 'react';
import { Shipment } from '../../../data/coldChainData';

interface SensorEventLogProps {
  shipment: Shipment;
}

export const SensorEventLog: React.FC<SensorEventLogProps> = ({ shipment }) => {
  const { events } = shipment;

  return (
    <div className="bg-white border border-ink-200/50 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-ink-100 bg-ink-50/50">
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">Sensor Event Log</h3>
      </div>
      
      <div className="flex-grow overflow-x-auto overflow-y-auto max-h-[300px]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white sticky top-0 border-b border-ink-100 text-[10px] uppercase font-bold tracking-wider text-ink-400">
            <tr>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Event</th>
              <th className="px-4 py-2">Source</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {events.length > 0 ? (
              events.map((event, idx) => (
                <tr key={idx} className="hover:bg-ink-50/50 transition-colors">
                  <td className="px-4 py-3 text-ink-500 text-xs font-mono">{event.time}</td>
                  <td className="px-4 py-3 font-medium text-ink-900">{event.event}</td>
                  <td className="px-4 py-3 text-ink-600">{event.source}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      event.status === 'NORMAL' || event.status === 'SECURE' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-ink-400 italic text-sm">
                  No sensor events recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
