import React from 'react';

interface TableRowData {
  region: string;
  forecastDemand: number;
  currentStock: number;
  collectionCapacity: number;
  projectedGap: number;
  priority: string;
  primaryDriver: string;
}

interface CollectionPlanningTableProps {
  data: TableRowData[];
  selectedRegion: string;
  onSelect: (region: string) => void;
}

export const CollectionPlanningTable: React.FC<CollectionPlanningTableProps> = ({ data, selectedRegion, onSelect }) => {
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-blood-100 text-blood-800 border-blood-200';
      case 'HIGH': return 'bg-blood-50 text-blood-700 border-blood-100';
      case 'WATCH': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'LOW': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-ink-100 text-ink-800 border-ink-200';
    }
  };

  return (
    <div className="bg-white border border-ink-200/50 rounded-2xl shadow-sm overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-ink-100 flex justify-between items-center bg-ink-50/50">
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">Collection Planning Table</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white border-b border-ink-100 text-[10px] uppercase font-bold tracking-wider text-ink-400">
            <tr>
              <th className="px-6 py-3">Region</th>
              <th className="px-6 py-3 text-right">Forecast Demand</th>
              <th className="px-6 py-3 text-right">Current Stock</th>
              <th className="px-6 py-3 text-right">Collection Capacity</th>
              <th className="px-6 py-3 text-right">Projected Gap</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3">Primary Driver</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {data.map((row) => {
              const isSelected = selectedRegion === row.region;
              const isShortage = row.projectedGap < 0;
              
              return (
                <tr 
                  key={row.region}
                  onClick={() => onSelect(row.region)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-blood-50/50' : 'hover:bg-ink-50/50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <span className={`font-bold ${isSelected ? 'text-blood-800' : 'text-ink-900'}`}>
                      {row.region}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-ink-600">
                    {row.forecastDemand.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-ink-600">
                    {row.currentStock.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-ink-600">
                    {row.collectionCapacity.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${isShortage ? 'text-blood-600' : 'text-emerald-600'}`}>
                    {row.projectedGap > 0 ? '+' : ''}{row.projectedGap.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${getPriorityColor(row.priority)}`}>
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ink-600">
                    <span className="text-xs">{row.primaryDriver}</span>
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
