import React from 'react';
import { GitMerge } from 'lucide-react';

interface BottleneckPanelProps {
  bottlenecks: { id: string; name: string; score: number; reason: string }[];
}

export const BottleneckPanel: React.FC<BottleneckPanelProps> = ({ bottlenecks }) => {
  return (
    <div className="bg-white border border-ink-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-ink-100 flex items-center gap-2">
        <GitMerge className="w-4 h-4 text-ink-500" />
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">
          Network Bottlenecks
        </h3>
      </div>
      
      <div className="p-6 flex-grow flex flex-col gap-4 overflow-y-auto">
        {bottlenecks.length === 0 ? (
          <div className="text-center text-ink-400 text-sm py-8 italic">
            No critical bottlenecks detected in the current network state.
          </div>
        ) : (
          bottlenecks.map((b, idx) => (
            <div key={b.id} className="bg-ink-50/50 border border-ink-100 rounded-lg p-4 flex gap-4">
              <div className="text-xl font-editorial font-bold text-ink-300">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-ink-900">{b.name}</h4>
                  <div className="text-right">
                    <div className="text-xl font-editorial font-bold text-blood-600 leading-none">{Math.round(b.score)}</div>
                    <div className="text-[9px] uppercase font-bold tracking-widest text-ink-400">Stress Score</div>
                  </div>
                </div>
                <p className="text-xs text-ink-600 leading-relaxed italic border-l-2 border-amber-400 pl-3">
                  "{b.reason}"
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
