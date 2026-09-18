import React, { useState } from 'react';
import { Shipment } from '../../../data/coldChainData';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { SentinelScoreDetails } from '../utils/sentinelRiskEngine';

interface ShipmentTableProps {
  shipments: Shipment[];
  resultsMap: Record<string, SentinelScoreDetails>;
  selectedId: string;
  onSelect: (id: string) => void;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({ shipments, resultsMap, selectedId, onSelect }) => {
  const [sortRiskFirst, setSortRiskFirst] = useState(true);

  const sortedShipments = [...shipments].sort((a, b) => {
    if (!sortRiskFirst) return 0;
    const scoreA = resultsMap[a.id]?.totalScore || 0;
    const scoreB = resultsMap[b.id]?.totalScore || 0;
    return scoreB - scoreA; // descending
  });

  return (
    <div className="bg-white border border-ink-200/50 rounded-2xl shadow-sm overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-ink-100 bg-ink-50/50 flex justify-between items-center">
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">Active Cold-Chain Shipments</h3>
        
        <button 
          onClick={() => setSortRiskFirst(!sortRiskFirst)}
          className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded transition-colors ${
            sortRiskFirst ? 'bg-ink-900 text-white' : 'bg-white border border-ink-200 text-ink-600'
          }`}
        >
          Highest Risk First
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white border-b border-ink-100 text-[10px] uppercase font-bold tracking-wider text-ink-400">
            <tr>
              <th className="px-6 py-3">Shipment</th>
              <th className="px-6 py-3">Destination</th>
              <th className="px-6 py-3">Temp</th>
              <th className="px-6 py-3">Transport Status</th>
              <th className="px-6 py-3">Risk Level</th>
              <th className="px-6 py-3 text-right">Sentinel Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {sortedShipments.map((shipment) => {
              const isSelected = selectedId === shipment.id;
              const details = resultsMap[shipment.id];
              const isHighRisk = details && (details.riskLevel === 'HIGH' || details.riskLevel === 'CRITICAL');
              const isWatch = details && details.riskLevel === 'WATCH';
              
              return (
                <tr 
                  key={shipment.id}
                  onClick={() => onSelect(shipment.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-blood-50' : 'hover:bg-ink-50/50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`font-bold ${isSelected ? 'text-blood-800' : 'text-ink-900'}`}>
                        {shipment.id}
                      </span>
                      {details && isHighRisk && (
                         <span className="text-[9px] uppercase font-bold text-blood-600 tracking-wider mt-0.5">
                           Driver: {details.topDriver.name}
                         </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-ink-600 truncate max-w-[150px]" title={shipment.destination}>
                    {shipment.destination}
                  </td>
                  <td className="px-6 py-4 font-semibold text-ink-900">
                    {shipment.temperature.toFixed(1)}°C
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-ink-100 text-ink-600 px-2 py-1 rounded">
                      {shipment.routeStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1 w-max ${
                      isHighRisk ? 'bg-blood-100 text-blood-800' :
                      isWatch ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isHighRisk && <AlertCircle className="w-3 h-3" />}
                      {!isHighRisk && !isWatch && <ShieldCheck className="w-3 h-3" />}
                      {details ? details.riskLevel : 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-editorial font-bold text-lg ${
                      isHighRisk ? 'text-blood-700' : isWatch ? 'text-amber-600' : 'text-ink-900'
                    }`}>
                      {details ? details.totalScore : '--'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
