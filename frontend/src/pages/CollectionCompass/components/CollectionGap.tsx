import React from 'react';
import { AlertCircle, Zap } from 'lucide-react';

interface CollectionGapProps {
  gap: number;
  originalGap?: number;
  isSimulationMode: boolean;
}

export const CollectionGap: React.FC<CollectionGapProps> = ({ gap, originalGap, isSimulationMode }) => {
  const isShortage = gap < 0;
  
  const hasShifted = isSimulationMode && originalGap !== undefined && originalGap !== gap;
  const gapDiff = hasShifted ? gap - originalGap! : 0;

  return (
    <div className={`bg-white border ${isSimulationMode ? 'border-amber-200' : 'border-ink-200/50'} rounded-2xl shadow-sm p-6 h-full flex flex-col justify-center transition-colors duration-500`}>
      <div className="flex items-center gap-2 mb-4">
        {isSimulationMode ? (
          <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
        ) : isShortage ? (
          <AlertCircle className="w-5 h-5 text-blood-600" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          </div>
        )}
        <h3 className={`text-xs font-bold uppercase tracking-wider ${isSimulationMode ? 'text-amber-600' : 'text-ink-900'}`}>
          {isSimulationMode ? 'Simulated Gap' : 'Projected Collection Gap'}
        </h3>
      </div>
      
      {hasShifted ? (
        <div className="mb-4 animate-fade-in">
          <div className="flex justify-between items-end mb-2 border-b border-ink-100 pb-2">
            <span className="text-[10px] font-bold text-ink-400 uppercase tracking-widest">Before</span>
            <span className="font-mono font-bold text-ink-400 text-lg">{originalGap! > 0 ? '+' : ''}{originalGap?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">After</span>
            <span className={`text-3xl font-editorial font-bold ${isShortage ? 'text-blood-600' : 'text-emerald-600'}`}>
              {gap > 0 ? '+' : ''}{gap.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-ink-100">
            <span className="text-[9px] font-bold text-ink-500 uppercase tracking-widest">Change</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${gapDiff > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-blood-100 text-blood-700'}`}>
              {gapDiff > 0 ? '+' : ''}{gapDiff.toLocaleString()}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-end gap-2 mb-4">
          <div className={`text-6xl font-editorial font-bold ${isSimulationMode ? 'text-amber-500' : isShortage ? 'text-blood-700' : 'text-emerald-600'}`}>
            {isShortage ? gap.toLocaleString() : `+${gap.toLocaleString()}`}
          </div>
          <div className="text-lg text-ink-500 font-sans pb-1">units</div>
        </div>
      )}
      
      <p className="text-sm text-ink-600 leading-relaxed max-w-sm mt-auto pt-4 border-t border-ink-100">
        {isSimulationMode 
          ? "Simulated demand and capacity constraints project this operational gap within the selected window."
          : isShortage 
            ? "Projected demand is expected to exceed available collection capacity within the selected planning window."
            : "Available collection capacity and current stock are projected to meet or exceed forecast demand."}
      </p>
    </div>
  );
};
