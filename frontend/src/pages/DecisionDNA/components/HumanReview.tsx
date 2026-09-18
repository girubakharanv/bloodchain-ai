import React from 'react';
import { UserCheck, Edit2, Search, CheckCircle } from 'lucide-react';

interface HumanReviewProps {
  required: boolean;
  status: 'REQUIRED' | 'APPROVAL_RECORDED' | 'ADJUSTMENT_MODE';
  onStatusChange: (status: 'REQUIRED' | 'APPROVAL_RECORDED' | 'ADJUSTMENT_MODE') => void;
  currentStage: number;
}

export const HumanReview: React.FC<HumanReviewProps> = ({ 
  required,
  status,
  onStatusChange,
  currentStage
}) => {
  const isVisible = currentStage >= 6; // Shows up late in the trace
  
  if (!isVisible) {
    return (
      <div className="bg-ink-900 border border-ink-800 rounded-2xl p-8 shadow-lg flex flex-col justify-between h-full opacity-20 pointer-events-none transition-opacity duration-700">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-5 h-5 text-ink-600" />
            <h3 className="text-sm font-bold text-ink-600 uppercase tracking-widest">
              HUMAN REVIEW
            </h3>
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-3 rounded-full bg-ink-700" />
            <div className="text-xl font-bold text-ink-600">Awaiting Trace...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ink-900 border border-ink-800 rounded-2xl p-8 shadow-lg flex flex-col justify-between h-full animate-fade-in relative overflow-hidden transition-all duration-700">
      {status === 'APPROVAL_RECORDED' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none animate-fade-in" />
      )}
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <UserCheck className="w-5 h-5 text-ink-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            HUMAN REVIEW
          </h3>
        </div>
        
        <div className="flex items-center gap-3 mb-8">
          {required ? (
            status === 'APPROVAL_RECORDED' ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <div className="text-xl font-bold text-emerald-400">
                  Approval Recorded
                </div>
              </>
            ) : status === 'ADJUSTMENT_MODE' ? (
              <>
                <Edit2 className="w-4 h-4 text-amber-500" />
                <div className="text-xl font-bold text-amber-400">
                  Adjustment Mode
                </div>
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                <div className="text-xl font-bold text-white">
                  Ready for operational review
                </div>
              </>
            )
          ) : (
            <>
              <div className="w-3 h-3 rounded-full bg-ink-600" />
              <div className="text-xl font-bold text-ink-400">
                Review not required
              </div>
            </>
          )}
        </div>
        
        {status === 'ADJUSTMENT_MODE' ? (
          <div className="mb-8 bg-ink-950 p-4 rounded-lg border border-amber-900/50">
            <p className="text-xs text-amber-500 mb-2 font-bold uppercase tracking-widest">Prototype Mode</p>
            <p className="text-xs text-ink-300">
              In production, this exposes a secure form to override the generated logistics recommendation.
            </p>
            <button 
              onClick={() => onStatusChange('REQUIRED')}
              className="mt-4 text-[10px] text-ink-500 hover:text-white uppercase tracking-widest font-bold underline"
            >
              Cancel Adjustment
            </button>
          </div>
        ) : (
          <p className="text-sm text-ink-400 italic mb-8">
            This recommendation is ready for final authorization by the regional logistics coordinator.
          </p>
        )}
      </div>
      
      <div className="space-y-3 relative z-10">
        <button 
          onClick={() => onStatusChange('APPROVAL_RECORDED')}
          disabled={!required || status === 'APPROVAL_RECORDED'}
          className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold tracking-widest uppercase transition-all ${
            status === 'APPROVAL_RECORDED' 
              ? 'bg-emerald-900/20 text-emerald-500 border border-emerald-900/50 cursor-not-allowed'
              : 'bg-blood-600 hover:bg-blood-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]'
          }`}
        >
          {status === 'APPROVAL_RECORDED' ? 'Approved' : 'Approve Decision'}
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onStatusChange('ADJUSTMENT_MODE')}
            disabled={!required || status === 'ADJUSTMENT_MODE'}
            className="py-3 border border-ink-700 hover:border-ink-500 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-ink-300 hover:text-white transition-colors"
          >
            <Edit2 className="w-3 h-3" />
            Adjust
          </button>
          
          <button 
            onClick={() => {
              // Simply scroll to top as a "Review Details" action
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="py-3 border border-ink-700 hover:border-ink-500 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-ink-300 hover:text-white transition-colors"
          >
            <Search className="w-3 h-3" />
            Review Details
          </button>
        </div>
      </div>
    </div>
  );
};
