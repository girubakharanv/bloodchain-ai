import React, { useState, useEffect } from 'react';
import { BloodUnit } from '../data/bloodPassportData';
import { Database, ChevronDown, ChevronUp, Fingerprint, Lock, Link as LinkIcon, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { VerificationResult, generateRecordHash } from '../utils/ledgerIntegrityEngine';

interface LedgerEventTableProps {
  unit: BloodUnit;
  verificationResult: VerificationResult | null;
  activeEventIndex: number;
}

export const LedgerEventTable: React.FC<LedgerEventTableProps> = ({ unit, verificationResult, activeEventIndex }) => {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [calculatedHashes, setCalculatedHashes] = useState<Record<string, string>>({});

  const toggleEvent = (id: string) => {
    setExpandedEventId(prev => prev === id ? null : id);
  };

  // Pre-calculate hashes for the UI display when expanded
  useEffect(() => {
    if (!expandedEventId) return;
    
    const event = unit.events.find(e => e.id === expandedEventId);
    if (!event) return;
    
    generateRecordHash(unit.id, event, event.previousRecordId ?? '0000000000000000')
      .then(hash => {
        setCalculatedHashes(prev => ({ ...prev, [event.id]: hash }));
      });
  }, [expandedEventId, unit]);

  return (
    <div className="bg-white border border-ink-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-ink-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-ink-400" />
          <h3 className="text-xs font-bold text-ink-900 uppercase tracking-widest">
            LEDGER EVENTS
          </h3>
        </div>
        <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest">
           {unit.events.length} EVENTS RECORDED
        </div>
      </div>
      
      <div className="flex-grow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink-50/50 border-b border-ink-200">
              <th className="px-6 py-3 text-[10px] font-bold text-ink-500 uppercase tracking-widest whitespace-nowrap">Timestamp</th>
              <th className="px-6 py-3 text-[10px] font-bold text-ink-500 uppercase tracking-widest whitespace-nowrap">Event</th>
              <th className="px-6 py-3 text-[10px] font-bold text-ink-500 uppercase tracking-widest whitespace-nowrap">Location</th>
              <th className="px-6 py-3 text-[10px] font-bold text-ink-500 uppercase tracking-widest whitespace-nowrap">Actor</th>
              <th className="px-6 py-3 text-[10px] font-bold text-ink-500 uppercase tracking-widest whitespace-nowrap text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {unit.events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-ink-500 italic text-sm">
                  No events recorded for this unit.
                </td>
              </tr>
            ) : (
              unit.events.map((event, idx) => {
                const isInvalid = verificationResult?.invalidEvents.includes(event.id) && idx <= activeEventIndex;
                const isUnverified = verificationResult && !verificationResult.valid && !isInvalid && 
                  idx > (verificationResult.firstMismatchIndex ?? 999) && idx <= activeEventIndex;
                const isFuture = idx > activeEventIndex;
                const isCurrent = idx === activeEventIndex;
                
                return (
                  <React.Fragment key={event.id}>
                    <tr 
                      className={`cursor-pointer transition-all duration-300 group ${
                        isFuture ? 'opacity-30 hover:opacity-50 bg-ink-50' :
                        isInvalid ? 'bg-amber-50 hover:bg-amber-100' :
                        isUnverified ? 'bg-ink-50/30 hover:bg-ink-100/50' :
                        isCurrent ? 'bg-emerald-50/30 hover:bg-emerald-50 border-l-4 border-l-emerald-500 shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]' :
                        'hover:bg-ink-50/50 border-l-4 border-l-transparent'
                      }`}
                      onClick={() => toggleEvent(event.id)}
                    >
                      <td className="px-6 py-4 font-mono text-xs text-ink-600 whitespace-nowrap flex items-center gap-2">
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block"></span>}
                        {event.timestamp}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-ink-900 whitespace-nowrap">
                        {event.event}
                      </td>
                      <td className={`px-6 py-4 text-xs whitespace-nowrap ${isInvalid ? 'text-amber-700 font-bold' : 'text-ink-600'}`}>
                        {event.location}
                      </td>
                      <td className="px-6 py-4 text-xs text-ink-600 whitespace-nowrap">
                        {event.actor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                         <div className="flex items-center justify-end gap-3">
                           {isFuture ? (
                             <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-ink-100 text-ink-400">
                               PENDING
                             </span>
                           ) : isInvalid ? (
                             <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-amber-200 text-amber-800">
                               INVALID
                             </span>
                           ) : isUnverified ? (
                             <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-ink-200 text-ink-600">
                               UNVERIFIED
                             </span>
                           ) : (
                             <span className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded ${
                               isCurrent ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-50 text-emerald-600'
                             }`}>
                               {event.status}
                             </span>
                           )}
                           {expandedEventId === event.id ? (
                             <ChevronUp className="w-4 h-4 text-ink-400 group-hover:text-ink-600" />
                           ) : (
                             <ChevronDown className="w-4 h-4 text-ink-400 group-hover:text-ink-600" />
                           )}
                         </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Event Details */}
                    {expandedEventId === event.id && (
                      <tr className={isInvalid ? 'bg-amber-950' : 'bg-ink-900'}>
                        <td colSpan={5} className="px-0 py-0">
                          <div className="p-6 border-b border-ink-800 animate-fade-in">
                             <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-2">
                               <Fingerprint className={`w-4 h-4 ${isInvalid ? 'text-amber-500' : 'text-blood-500'}`} />
                               <h4 className="text-xs font-bold text-white uppercase tracking-widest">EVENT DETAILS</h4>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                               <div>
                                 <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">EVENT ID</div>
                                 <div className="font-mono text-sm font-bold text-white">{event.id}</div>
                               </div>
                               <div>
                                 <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">TIMESTAMP</div>
                                 <div className="font-mono text-sm font-bold text-white">{event.timestamp}</div>
                               </div>
                               <div>
                                 <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">EVENT TYPE</div>
                                 <div className="text-sm font-bold text-white">{event.event}</div>
                               </div>
                               <div>
                                 <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">VERIFICATION</div>
                                 <div className="flex items-center gap-1.5">
                                   {isFuture ? (
                                      <span className="text-sm font-bold text-ink-400">PENDING</span>
                                   ) : isInvalid ? (
                                     <>
                                      <XCircle className="w-4 h-4 text-amber-500" />
                                      <span className="text-sm font-bold text-amber-400">MISMATCH</span>
                                     </>
                                   ) : isUnverified ? (
                                     <>
                                      <AlertCircle className="w-4 h-4 text-ink-400" />
                                      <span className="text-sm font-bold text-ink-300">UNVERIFIED</span>
                                     </>
                                   ) : (
                                     <>
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                      <span className="text-sm font-bold text-white">VERIFIED</span>
                                     </>
                                   )}
                                 </div>
                               </div>
                             </div>
                             
                             {/* Ledger Record Hashing (Simulated) */}
                             <div className="bg-ink-950 border border-white/10 rounded-xl p-4 flex flex-col xl:flex-row items-center gap-4">
                                <div className="flex-1 w-full border border-ink-800 rounded p-3 bg-ink-900/50 relative">
                                   <div className="text-[9px] text-ink-400 uppercase tracking-widest mb-1">PREVIOUS RECORD HASH</div>
                                   <div className="font-mono text-xs text-ink-300 truncate">
                                     {event.previousRecordId || 'GENESIS'}
                                   </div>
                                </div>
                                
                                <div className="text-ink-600 hidden xl:block">
                                  <LinkIcon className="w-4 h-4" />
                                </div>
                                
                                <div className={`flex-1 w-full border rounded p-3 relative ${isInvalid ? 'border-amber-900/50 bg-amber-900/10' : 'border-blood-900/30 bg-blood-900/10'}`}>
                                   <div className={`text-[9px] uppercase tracking-widest mb-1 flex items-center gap-1 ${isInvalid ? 'text-amber-400' : 'text-blood-400'}`}>
                                     <Lock className="w-3 h-3" /> STORED RECORD HASH
                                   </div>
                                   <div className="font-mono text-xs text-white truncate">
                                     {event.recordId}
                                   </div>
                                </div>

                                <div className="text-ink-600 hidden xl:block">
                                  <Lock className="w-4 h-4" />
                                </div>

                                <div className={`flex-1 w-full border rounded p-3 relative ${
                                  calculatedHashes[event.id] === undefined ? 'border-ink-800' :
                                  isInvalid ? 'border-amber-500 bg-amber-900/20' : 'border-emerald-500/50 bg-emerald-900/10'
                                }`}>
                                   <div className={`text-[9px] uppercase tracking-widest mb-1 flex items-center gap-1 ${
                                      isInvalid ? 'text-amber-400' : 'text-emerald-400'
                                   }`}>
                                     <Database className="w-3 h-3" /> CALCULATED HASH
                                   </div>
                                   <div className="font-mono text-xs text-white truncate">
                                     {calculatedHashes[event.id] || 'CALCULATING...'}
                                   </div>
                                </div>
                             </div>
                             
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
