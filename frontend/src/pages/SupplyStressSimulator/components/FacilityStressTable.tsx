import React from 'react';
import { FacilityStressResult } from '../utils/supplyStressEngine';
import { Building2, AlertTriangle } from 'lucide-react';

interface FacilityStressTableProps {
  facilityStress: FacilityStressResult[];
}

export const FacilityStressTable: React.FC<FacilityStressTableProps> = ({ facilityStress }) => {
  
  const getBadgeClass = (level: string, isOffline: boolean) => {
    if (isOffline) return 'bg-ink-800 text-ink-500 border border-ink-700 opacity-50';
    if (level === 'CRITICAL') return 'bg-blood-900/50 text-blood-400 border border-blood-800/50';
    if (level === 'HIGH') return 'bg-amber-900/50 text-amber-500 border border-amber-800/50';
    if (level === 'WATCH') return 'bg-emerald-900/50 text-emerald-400 border border-emerald-800/50';
    return 'bg-ink-100 text-ink-600 border border-ink-200';
  };

  const sortedFacilities = [...facilityStress].sort((a, b) => b.overallScore - a.overallScore);

  return (
    <div className="bg-white border border-ink-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-ink-100 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-ink-500" />
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">
          Facility Stress
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink-50/50 border-b border-ink-100 text-[9px] uppercase font-bold tracking-widest text-ink-500">
              <th className="px-6 py-3 font-bold">Facility</th>
              <th className="px-4 py-3 font-bold">Inventory Press.</th>
              <th className="px-4 py-3 font-bold">Demand Press.</th>
              <th className="px-4 py-3 font-bold">Transport Press.</th>
              <th className="px-4 py-3 font-bold">Expiry Press.</th>
              <th className="px-6 py-3 font-bold text-right">Overall Stress</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {sortedFacilities.map((facility, idx) => (
              <tr key={facility.nodeId} className={`border-b border-ink-100 transition-colors hover:bg-ink-50 ${facility.isOffline ? 'bg-ink-50/50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`font-bold ${facility.isOffline ? 'text-ink-400 line-through' : 'text-ink-900'}`}>
                    {facility.name}
                  </div>
                  {facility.isOffline && <div className="text-[9px] uppercase font-bold tracking-widest text-blood-500 mt-0.5">OFFLINE</div>}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getBadgeClass(facility.inventoryPressure, facility.isOffline)}`}>
                    {facility.inventoryPressure}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getBadgeClass(facility.demandPressure, facility.isOffline)}`}>
                    {facility.demandPressure}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getBadgeClass(facility.transportPressure, facility.isOffline)}`}>
                    {facility.transportPressure}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getBadgeClass(facility.expiryPressure, facility.isOffline)}`}>
                    {facility.expiryPressure}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${getBadgeClass(facility.overallStress, facility.isOffline)}`}>
                    {facility.overallStress === 'CRITICAL' && !facility.isOffline && <AlertTriangle className="w-3 h-3" />}
                    {facility.isOffline ? 'OFFLINE' : facility.overallStress}
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
