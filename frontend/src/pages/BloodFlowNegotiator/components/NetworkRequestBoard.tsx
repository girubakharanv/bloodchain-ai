import React from 'react';
import type { BloodRequest, AllocationPlan } from '../negotiatorData';
import { ShieldAlert, Clock, Activity } from 'lucide-react';

interface NetworkRequestBoardProps {
  requests: BloodRequest[];
  allocation: AllocationPlan | null;
  mode: 'conflict' | 'negotiating' | 'allocated';
}

export const NetworkRequestBoard: React.FC<NetworkRequestBoardProps> = ({ requests, allocation, mode }) => {
  return (
    <div className="bg-white border border-ink-200/40 rounded shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-ink-200/40 bg-paper/50">
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">Network Request Board</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-ink-100 bg-ink-50/50">
              <th className="p-3 text-[10px] font-bold text-ink-500 uppercase tracking-wider">Facility</th>
              <th className="p-3 text-[10px] font-bold text-ink-500 uppercase tracking-wider text-center">Local Stock</th>
              <th className="p-3 text-[10px] font-bold text-ink-500 uppercase tracking-wider text-center">Window</th>
              <th className="p-3 text-[10px] font-bold text-ink-500 uppercase tracking-wider text-center">Urgency</th>
              <th className="p-3 text-[10px] font-bold text-ink-500 uppercase tracking-wider text-center">Requested</th>
              <th className="p-3 text-[10px] font-bold text-ink-500 uppercase tracking-wider text-center">Allocation</th>
              <th className="p-3 text-[10px] font-bold text-ink-500 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {requests.map(req => {
              const allocated = allocation?.allocations.find(a => a.requestId === req.id);
              
              return (
                <tr key={req.id} className="group hover:bg-ink-50 transition-colors">
                  <td className="p-3 font-medium text-sm text-ink-900">
                    {req.facilityName}
                    <div className="text-[10px] text-ink-400 font-normal">{req.bloodGroup} / {req.component}</div>
                  </td>
                  
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${req.localStock < 5 ? 'bg-orange-100 text-orange-800' : 'bg-ink-100 text-ink-700'}`}>
                      {req.localStock}
                    </span>
                  </td>
                  
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs font-mono text-ink-600">
                      <Clock size={12} className={req.requiredWithinHours <= 2 ? 'text-blood-600' : 'text-ink-400'} />
                      {req.requiredWithinHours}h
                    </div>
                  </td>
                  
                  <td className="p-3 text-center">
                     <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${req.urgency === 'Emergency' ? 'bg-blood-50 text-blood-700' : req.urgency === 'Critical' ? 'bg-orange-50 text-orange-700' : 'bg-ink-100 text-ink-600'}`}>
                       {req.urgency}
                     </span>
                  </td>
                  
                  <td className="p-3 text-center font-mono font-bold text-sm text-ink-900">
                    {req.requestedUnits}
                  </td>
                  
                  <td className="p-3 text-center">
                    {mode === 'allocated' && allocated ? (
                      <span className="font-mono font-bold text-lg text-blood-700 px-2 py-1 bg-blood-50 border border-blood-100 rounded">
                        {allocated.allocatedUnits}
                      </span>
                    ) : mode === 'negotiating' ? (
                      <Activity size={18} className="mx-auto text-ink-400 animate-spin" />
                    ) : (
                      <span className="text-ink-300 font-mono text-lg">--</span>
                    )}
                  </td>
                  
                  <td className="p-3 text-right">
                    {mode === 'allocated' ? (
                      <span className="text-xs font-bold text-ink-500 uppercase tracking-widest">Review</span>
                    ) : mode === 'conflict' ? (
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center justify-end gap-1">
                        <ShieldAlert size={12} /> Conflict
                      </span>
                    ) : (
                      <span className="text-[10px] text-ink-400 uppercase tracking-widest">Processing</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
