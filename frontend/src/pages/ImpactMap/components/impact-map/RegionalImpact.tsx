import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { RegionalImpact as RegionalImpactType } from '../../types/impactMap';

interface RegionalImpactProps {
  regions: RegionalImpactType[];
}

export const RegionalImpact: React.FC<RegionalImpactProps> = ({ regions }) => {
  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-8 shadow-sm animate-fade-in h-full">
      <div className="flex items-center gap-2 mb-8 border-b border-ink-100 pb-4">
        <MapPin className="w-5 h-5 text-ink-400" />
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">
          IMPACT BY REGION
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-ink-400 uppercase tracking-widest border-b border-ink-100">
              <th className="pb-3 font-bold">Region</th>
              <th className="pb-3 font-bold text-center">Baseline Risk</th>
              <th className="pb-3 text-center"></th>
              <th className="pb-3 font-bold text-center">Optimized Risk</th>
              <th className="pb-3 font-bold text-right">Change</th>
              <th className="pb-3 font-bold text-right">Primary Driver</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {regions.map((region, idx) => (
              <tr key={idx} className="group hover:bg-ink-50 transition-colors">
                <td className="py-4 text-sm font-bold text-ink-900">
                  {region.region}
                </td>
                <td className="py-4 text-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                    region.baselineRisk === 'High' ? 'bg-amber-100 text-amber-700' :
                    region.baselineRisk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {region.baselineRisk}
                  </span>
                </td>
                <td className="py-4 text-center">
                  <ArrowRight className="w-4 h-4 text-ink-300 inline-block" />
                </td>
                <td className="py-4 text-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                    region.optimizedRisk === 'High' ? 'bg-amber-100 text-amber-700' :
                    region.optimizedRisk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {region.optimizedRisk}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <span className="text-sm font-bold text-emerald-600">
                    {region.change}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <span className="text-xs text-ink-500">
                    {region.primaryDriver}
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
