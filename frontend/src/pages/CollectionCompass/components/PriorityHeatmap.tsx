import React from 'react';
import { BloodGroup } from '../../../data/collectionCompassData';

interface HeatmapData {
  region: string;
  groups: Record<BloodGroup, string>;
}

interface PriorityHeatmapProps {
  data: HeatmapData[];
  selectedGroup: BloodGroup | 'All';
  onSelectGroup: (group: BloodGroup | 'All') => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const PriorityHeatmap: React.FC<PriorityHeatmapProps> = ({ data, selectedGroup, onSelectGroup }) => {
  
  const getCellColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-blood-700 text-white';
      case 'HIGH': return 'bg-blood-500 text-white';
      case 'WATCH': return 'bg-amber-400 text-ink-900';
      case 'LOW': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-ink-100 text-ink-400';
    }
  };

  return (
    <div className="bg-white border border-ink-200/50 rounded-2xl shadow-sm overflow-hidden mt-6 overflow-x-auto">
      <div className="px-6 py-4 border-b border-ink-100 flex justify-between items-center bg-ink-50/50">
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">Group Priority Matrix</h3>
      </div>
      
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr>
            <th className="px-4 py-3 bg-white sticky left-0 z-10 border-b border-r border-ink-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-ink-400">Region</span>
            </th>
            {BLOOD_GROUPS.map(bg => (
              <th key={bg} className="px-2 py-3 border-b border-ink-100 text-center cursor-pointer hover:bg-ink-50 transition-colors" onClick={() => onSelectGroup(bg === selectedGroup ? 'All' : bg)}>
                <span className={`text-xs font-bold ${selectedGroup === bg ? 'text-blood-600' : 'text-ink-600'}`}>
                  {bg}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.region} className={idx !== data.length - 1 ? 'border-b border-ink-50' : ''}>
              <td className="px-4 py-3 bg-white sticky left-0 z-10 border-r border-ink-100 font-bold text-ink-900 text-xs uppercase tracking-wide">
                {row.region}
              </td>
              {BLOOD_GROUPS.map(bg => {
                const priority = row.groups[bg];
                const isSelected = selectedGroup === 'All' || selectedGroup === bg;
                return (
                  <td key={bg} className="p-1">
                    <div className={`w-full h-8 flex items-center justify-center rounded text-[9px] font-bold tracking-widest uppercase transition-opacity ${getCellColor(priority)} ${!isSelected ? 'opacity-20' : 'opacity-100'}`}>
                      {priority.substring(0, 1)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="px-6 py-3 border-t border-ink-100 bg-white flex gap-4 text-[10px] font-bold uppercase tracking-wider text-ink-500 justify-end">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blood-700" /> Critical</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blood-500" /> High</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-400" /> Watch</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-100" /> Low</div>
      </div>
    </div>
  );
};
