import React from 'react';
import { BloodGroupStressResult } from '../utils/supplyStressEngine';
import { Droplets, AlertTriangle } from 'lucide-react';

interface BloodGroupStressProps {
  bloodGroupStress: BloodGroupStressResult[];
}

export const BloodGroupStress: React.FC<BloodGroupStressProps> = ({ bloodGroupStress }) => {

  const getBadgeClass = (level: string) => {
    if (level === 'CRITICAL') return 'bg-blood-900/50 text-blood-400 border border-blood-800/50';
    if (level === 'HIGH') return 'bg-amber-900/50 text-amber-500 border border-amber-800/50';
    if (level === 'WATCH') return 'bg-emerald-900/50 text-emerald-400 border border-emerald-800/50';
    return 'bg-ink-100 text-ink-600 border border-ink-200';
  };

  return (
    <div className="bg-white border border-ink-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-ink-100 flex items-center gap-2">
        <Droplets className="w-4 h-4 text-blood-500" />
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">
          Blood Group Stress
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink-50/50 border-b border-ink-100 text-[9px] uppercase font-bold tracking-widest text-ink-500">
              <th className="px-6 py-3 font-bold w-20">Group</th>
              <th className="px-4 py-3 font-bold">Supply</th>
              <th className="px-4 py-3 font-bold">Demand</th>
              <th className="px-4 py-3 font-bold text-right">Proj. Gap</th>
              <th className="px-6 py-3 font-bold text-right">Stress</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {bloodGroupStress.map((bg) => (
              <tr key={bg.group} className="border-b border-ink-100 transition-colors hover:bg-ink-50">
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="font-bold text-blood-600 text-lg">
                    {bg.group}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getBadgeClass(bg.supply)}`}>
                    {bg.supply}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getBadgeClass(bg.demand)}`}>
                    {bg.demand}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <span className={`font-mono font-bold ${bg.gap < 0 ? 'text-blood-600' : 'text-emerald-600'}`}>
                    {bg.gap > 0 ? '+' : ''}{bg.gap.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-right">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${getBadgeClass(bg.stress)}`}>
                    {bg.stress === 'CRITICAL' && <AlertTriangle className="w-3 h-3" />}
                    {bg.stress}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
