import React from 'react';
import { Droplet, ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { BloodGroupImpact as BloodGroupImpactType } from '../../types/impactMap';

interface BloodGroupImpactProps {
  bloodGroups: BloodGroupImpactType[];
}

export const BloodGroupImpact: React.FC<BloodGroupImpactProps> = ({ bloodGroups }) => {
  const getTrendIcon = (trend: 'UP' | 'DOWN' | 'NEUTRAL', positiveIsDown: boolean) => {
    if (trend === 'NEUTRAL') return <Minus className="w-3 h-3 text-ink-300" />;
    if (trend === 'DOWN') {
      return <ArrowDownRight className={`w-3 h-3 ${positiveIsDown ? 'text-emerald-500' : 'text-amber-500'}`} />;
    }
    return <ArrowUpRight className={`w-3 h-3 ${!positiveIsDown ? 'text-emerald-500' : 'text-amber-500'}`} />;
  };

  const getCellColor = (level: 'HIGH' | 'MEDIUM' | 'LOW', isRisk: boolean) => {
    if (isRisk) {
      if (level === 'HIGH') return 'bg-amber-50 text-amber-700 border-amber-100';
      if (level === 'MEDIUM') return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    } else {
      if (level === 'HIGH') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      if (level === 'MEDIUM') return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-8 shadow-sm animate-fade-in h-full">
      <div className="flex items-center gap-2 mb-8 border-b border-ink-100 pb-4">
        <Droplet className="w-5 h-5 text-blood-600" />
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">
          IMPACT BY BLOOD GROUP
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] text-ink-400 uppercase tracking-widest border-b border-ink-100">
              <th className="pb-3 font-bold">Group</th>
              <th className="pb-3 font-bold text-center">Expiry Risk</th>
              <th className="pb-3 font-bold text-center">Shortage Exposure</th>
              <th className="pb-3 font-bold text-center">Allocation Efficiency</th>
              <th className="pb-3 font-bold text-center">Network Pressure</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {bloodGroups.map((bg, idx) => (
              <tr key={idx} className="group hover:bg-ink-50 transition-colors">
                <td className="py-3">
                  <div className="w-8 h-8 rounded-full bg-blood-50 border border-blood-100 flex items-center justify-center text-xs font-bold text-blood-700">
                    {bg.bloodGroup}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className={`flex items-center justify-between px-3 py-1.5 rounded text-[10px] font-bold border ${getCellColor(bg.expiryRisk, true)}`}>
                    {bg.expiryRisk}
                    {getTrendIcon(bg.expiryRiskTrend, true)}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className={`flex items-center justify-between px-3 py-1.5 rounded text-[10px] font-bold border ${getCellColor(bg.shortageExposure, true)}`}>
                    {bg.shortageExposure}
                    {getTrendIcon(bg.shortageExposureTrend, true)}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className={`flex items-center justify-between px-3 py-1.5 rounded text-[10px] font-bold border ${getCellColor(bg.allocationEfficiency, false)}`}>
                    {bg.allocationEfficiency}
                    {getTrendIcon(bg.allocationEfficiencyTrend, false)}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className={`flex items-center justify-center px-3 py-1.5 rounded text-[10px] font-bold border ${getCellColor(bg.networkPressure, true)}`}>
                    {bg.networkPressure}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
