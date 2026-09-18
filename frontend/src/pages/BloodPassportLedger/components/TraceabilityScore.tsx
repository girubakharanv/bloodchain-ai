import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import { VerificationResult } from '../utils/ledgerIntegrityEngine';

interface TraceabilityScoreProps {
  score: number;
  verificationResult: VerificationResult | null;
}

export const TraceabilityScore: React.FC<TraceabilityScoreProps> = ({ score, verificationResult }) => {
  // If invalid, decrease score based on valid records ratio
  let finalScore = score;
  if (verificationResult && !verificationResult.valid) {
    const validRatio = verificationResult.recordsValid / verificationResult.recordsChecked;
    finalScore = Math.floor(score * validRatio);
  }

  return (
    <div className="bg-white border border-ink-200 rounded-2xl shadow-sm overflow-hidden p-6 relative h-full">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-emerald-500" />
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-widest">
          TRACEABILITY SCORE
        </h3>
      </div>
      
      <div className="flex items-end gap-3 mb-6">
        <div className={`text-5xl font-editorial font-bold leading-none transition-colors ${verificationResult?.valid === false ? 'text-amber-500' : 'text-ink-900'}`}>
          {finalScore}
        </div>
        <div className="text-xl font-bold text-ink-400 mb-1">
          / 100
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-ink-100 rounded-full h-2 mb-6 overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${verificationResult?.valid === false ? 'bg-amber-500' : 'bg-emerald-500'}`}
          style={{ width: `${finalScore}%` }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-xs font-bold text-ink-600 mt-auto">
         <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-4 h-4 ${finalScore >= 14 ? (verificationResult?.valid === false ? 'text-amber-500' : 'text-emerald-500') : 'text-ink-200'}`} />
            Collection
         </div>
         <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-4 h-4 ${finalScore >= 28 ? (verificationResult?.valid === false ? 'text-amber-500' : 'text-emerald-500') : 'text-ink-200'}`} />
            Processing
         </div>
         <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-4 h-4 ${finalScore >= 42 ? (verificationResult?.valid === false ? 'text-amber-500' : 'text-emerald-500') : 'text-ink-200'}`} />
            Storage
         </div>
         <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-4 h-4 ${finalScore >= 57 ? (verificationResult?.valid === false ? 'text-amber-500' : 'text-emerald-500') : 'text-ink-200'}`} />
            Allocation
         </div>
         <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-4 h-4 ${finalScore >= 71 ? (verificationResult?.valid === false ? 'text-amber-500' : 'text-emerald-500') : 'text-ink-200'}`} />
            Dispatch
         </div>
         <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-4 h-4 ${finalScore >= 85 ? (verificationResult?.valid === false ? 'text-amber-500' : 'text-emerald-500') : 'text-ink-200'}`} />
            Transit
         </div>
         <div className="flex items-center gap-2">
            <CheckCircle2 className={`w-4 h-4 ${finalScore === 100 ? (verificationResult?.valid === false ? 'text-amber-500' : 'text-emerald-500') : 'text-ink-200'}`} />
            Destination
         </div>
      </div>

    </div>
  );
};
