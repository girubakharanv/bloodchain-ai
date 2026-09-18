import React from 'react';
import { BloodUnit } from '../data/bloodPassportData';
import { Network, CheckCircle2, AlertCircle } from 'lucide-react';

interface CustodyTimelineProps {
  unit: BloodUnit;
}

export const CustodyTimeline: React.FC<CustodyTimelineProps> = ({ unit }) => {
  return (
    <div className="bg-white border border-ink-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-ink-200 flex items-center gap-2">
        <Network className="w-4 h-4 text-ink-400" />
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-widest">
          CHAIN OF CUSTODY
        </h3>
      </div>
      
      <div className="p-6 flex-grow overflow-y-auto">
        {unit.custodyTransfers.length === 0 ? (
          <div className="text-center text-ink-500 italic text-sm py-8">
            No custody transfers recorded yet.
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-ink-200">
            {unit.custodyTransfers.map((transfer, idx) => (
              <div key={transfer.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Icon */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${
                  transfer.status === 'VERIFIED' ? 'bg-emerald-500' : 'bg-blood-500'
                }`}>
                  {transfer.status === 'VERIFIED' ? (
                     <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                     <AlertCircle className="w-4 h-4 text-white" />
                  )}
                </div>
                
                {/* Card */}
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-ink-50 border border-ink-200 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-mono text-xs font-bold text-ink-900">{transfer.timestamp}</div>
                    <div className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded ${
                      transfer.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 'bg-blood-100 text-blood-700'
                    }`}>
                      {transfer.status}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-ink-700 mb-1">
                    {transfer.fromLocation}
                  </div>
                  <div className="text-xs text-ink-500 uppercase tracking-widest mb-1">
                    ↓ TRANSFERRED TO
                  </div>
                  <div className="text-sm font-bold text-ink-900">
                    {transfer.toLocation}
                  </div>
                  <div className="mt-3 pt-3 border-t border-ink-200 text-[10px] font-bold text-ink-500 uppercase tracking-wider">
                    {transfer.event}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
