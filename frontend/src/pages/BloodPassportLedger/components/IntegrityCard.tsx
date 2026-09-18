import React from 'react';
import { BloodUnit } from '../data/bloodPassportData';
import { ShieldCheck, ShieldAlert, CheckCircle2, Loader2, Minus } from 'lucide-react';
import { VerificationResult } from '../utils/ledgerIntegrityEngine';

interface IntegrityCardProps {
  unit: BloodUnit;
  verificationResult: VerificationResult | null;
  isVerifying: boolean;
}

export const IntegrityCard: React.FC<IntegrityCardProps> = ({ unit, verificationResult, isVerifying }) => {
  const hasExceptions = verificationResult ? !verificationResult.valid : false;
  
  const recordsChecked = verificationResult ? verificationResult.recordsChecked : unit.events.length;
  const recordsValid = verificationResult ? verificationResult.recordsValid : '-';
  const recordsInvalid = verificationResult ? verificationResult.recordsInvalid : '-';

  return (
    <div className="bg-white border border-ink-200 rounded-2xl shadow-sm overflow-hidden p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-6">
          {isVerifying ? (
             <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
          ) : hasExceptions ? (
             <ShieldAlert className="w-5 h-5 text-amber-500" />
          ) : verificationResult ? (
             <ShieldCheck className="w-5 h-5 text-emerald-500" />
          ) : (
             <Minus className="w-5 h-5 text-ink-300" />
          )}
          <h3 className="text-xs font-bold text-ink-900 uppercase tracking-widest">
            LEDGER VERIFICATION
          </h3>
        </div>
        
        <div className="mb-6">
          {isVerifying ? (
            <div className="text-xl font-bold tracking-widest uppercase inline-block px-3 py-1 rounded bg-amber-50 text-amber-600">
              VERIFYING...
            </div>
          ) : !verificationResult ? (
            <div className="text-xl font-bold tracking-widest uppercase inline-block px-3 py-1 rounded bg-ink-100 text-ink-500">
              UNVERIFIED
            </div>
          ) : hasExceptions ? (
            <div className="text-xl font-bold tracking-widest uppercase inline-block px-3 py-1 rounded bg-amber-100 text-amber-700">
              MISMATCH DETECTED
            </div>
          ) : (
            <div className="text-xl font-bold tracking-widest uppercase inline-block px-3 py-1 rounded bg-emerald-100 text-emerald-700">
              VERIFIED
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div>
             <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">Records Checked</div>
             <div className="text-xl font-bold text-ink-900">{recordsChecked}</div>
           </div>
           <div>
             <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">Records Valid</div>
             <div className={`text-xl font-bold ${verificationResult?.valid ? 'text-emerald-600' : 'text-ink-900'}`}>{recordsValid}</div>
           </div>
           <div>
             <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">Records Invalid</div>
             <div className={`text-xl font-bold ${recordsInvalid !== '-' && recordsInvalid > 0 ? 'text-amber-500' : 'text-ink-300'}`}>{recordsInvalid}</div>
           </div>
           <div>
             <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">Tamper Evident</div>
             <div className="text-xl font-bold text-ink-900 flex items-center gap-1">
               <CheckCircle2 className="w-4 h-4 text-emerald-500" /> YES
             </div>
           </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-ink-100">
        <div className="bg-ink-50 border border-ink-200 rounded p-3">
          <p className="text-[10px] text-ink-500 italic leading-relaxed">
            <strong>Record Integrity:</strong> Each lifecycle event is linked to the previous event in the simulated ledger. If an event is modified, the chain can identify an integrity mismatch. <em>(Tamper-evident simulation)</em>
          </p>
        </div>
      </div>
    </div>
  );
};
