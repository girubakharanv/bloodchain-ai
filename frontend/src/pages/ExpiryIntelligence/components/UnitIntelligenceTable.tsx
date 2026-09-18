import React from 'react';
import type { BloodUnit } from '../../../data/bloodUnits';
import { ShieldAlert, Info, ArrowRight } from 'lucide-react';

interface UnitIntelligenceTableProps {
  units: (BloodUnit & { simulatedRisk: number; simulatedUtilization: string })[];
  selectedUnitId: string | null;
  onSelectUnit: (id: string) => void;
}

export const UnitIntelligenceTable: React.FC<UnitIntelligenceTableProps> = ({ units, selectedUnitId, onSelectUnit }) => {
  return (
    <div className="bg-white border border-ink-200/40 rounded shadow-sm flex flex-col h-[500px] overflow-hidden">
      <div className="p-6 border-b border-ink-200/40 flex justify-between items-center bg-paper/30">
        <div>
          <h2 className="text-xl font-editorial font-bold text-ink-900">Unit Intelligence</h2>
          <p className="text-sm text-ink-500">Prioritized by prototype logistics risk model</p>
        </div>
        <div className="text-xs text-ink-500 px-3 py-1 bg-ink-100 rounded-full font-medium">
          {units.length} units match filters
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {units.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-ink-400">
            <Info size={32} className="mb-2 opacity-50" />
            <p>No units match the current intelligence filters.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-ink-50 text-[10px] uppercase tracking-wider text-ink-500 sticky top-0 z-10">
              <tr>
                <th className="p-4 font-bold border-b border-ink-200/40">Unit</th>
                <th className="p-4 font-bold border-b border-ink-200/40">Group</th>
                <th className="p-4 font-bold border-b border-ink-200/40">Comp</th>
                <th className="p-4 font-bold border-b border-ink-200/40">Expires</th>
                <th className="p-4 font-bold border-b border-ink-200/40">Predicted Use</th>
                <th className="p-4 font-bold border-b border-ink-200/40">Risk</th>
                <th className="p-4 font-bold border-b border-ink-200/40">Network Signal</th>
                <th className="p-4 font-bold border-b border-ink-200/40">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-ink-100">
              {units.map((unit) => {
                const isSelected = selectedUnitId === unit.id;
                return (
                  <tr 
                    key={unit.id} 
                    onClick={() => onSelectUnit(unit.id)}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-blood-50' : 'hover:bg-ink-50'}`}
                  >
                    <td className="p-4 font-mono font-medium text-ink-900">{unit.id}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blood-100 text-blood-800 font-bold text-xs">
                        {unit.bloodGroup}
                      </span>
                    </td>
                    <td className="p-4 text-ink-600">{unit.component}</td>
                    <td className="p-4 font-medium">
                      <span className={unit.hoursRemaining < 48 ? 'text-blood-600 font-bold' : 'text-ink-900'}>
                        {unit.hoursRemaining}h
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        unit.simulatedUtilization === 'Low' ? 'bg-blood-100 text-blood-800' :
                        unit.simulatedUtilization === 'Medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {unit.simulatedUtilization}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-ink-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${unit.simulatedRisk > 80 ? 'bg-blood-600' : unit.simulatedRisk > 50 ? 'bg-orange-500' : 'bg-green-500'}`}
                            style={{ width: `${unit.simulatedRisk}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-ink-600">{Math.round(unit.simulatedRisk)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {unit.rescueOpportunityScore > 75 ? (
                         <span className="flex items-center gap-1 text-blood-700 text-xs font-bold">
                           <ShieldAlert size={14} /> Rescue opportunity
                         </span>
                      ) : unit.simulatedUtilization === 'High' ? (
                         <span className="text-green-600 text-xs">Expected utilization</span>
                      ) : (
                         <span className="text-ink-500 text-xs">Potential surplus</span>
                      )}
                    </td>
                    <td className="p-4">
                      <button className="flex items-center gap-1 text-xs font-bold text-ink-900 hover:text-blood-700 transition-colors">
                        Review <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
