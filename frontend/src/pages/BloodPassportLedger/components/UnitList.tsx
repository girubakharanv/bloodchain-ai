import React from 'react';
import { BloodUnit } from '../data/bloodPassportData';
import { Droplet, Box, Truck, MapPin, AlertCircle, Ban } from 'lucide-react';

interface UnitListProps {
  units: BloodUnit[];
  selectedUnitId: string | null;
  onSelect: (id: string) => void;
}

const getStateConfig = (state: string) => {
  switch(state) {
    case 'COLLECTED': return { bg: 'bg-emerald-50 text-emerald-700', icon: Droplet, dot: 'bg-emerald-500' };
    case 'PROCESSING': return { bg: 'bg-sky-50 text-sky-700', icon: Box, dot: 'bg-sky-500' };
    case 'STORED': return { bg: 'bg-indigo-50 text-indigo-700', icon: Box, dot: 'bg-indigo-500' };
    case 'ALLOCATED': return { bg: 'bg-purple-50 text-purple-700', icon: MapPin, dot: 'bg-purple-500' };
    case 'DISPATCHED': return { bg: 'bg-amber-50 text-amber-700', icon: Truck, dot: 'bg-amber-500' };
    case 'IN TRANSIT': return { bg: 'bg-amber-100 text-amber-800 border-amber-200 border', icon: Truck, dot: 'bg-amber-600 animate-pulse' };
    case 'ARRIVED': return { bg: 'bg-emerald-100 text-emerald-800', icon: MapPin, dot: 'bg-emerald-600' };
    case 'EXPIRED': return { bg: 'bg-ink-100 text-ink-600', icon: AlertCircle, dot: 'bg-ink-500' };
    case 'QUARANTINED': return { bg: 'bg-blood-50 text-blood-700', icon: Ban, dot: 'bg-blood-500' };
    default: return { bg: 'bg-ink-100 text-ink-600', icon: Box, dot: 'bg-ink-400' };
  }
};

export const UnitList: React.FC<UnitListProps> = ({ units, selectedUnitId, onSelect }) => {
  return (
    <div className="bg-white border border-ink-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
      <div className="px-5 py-3 border-b border-ink-200 bg-ink-50/50 flex justify-between items-center">
        <h3 className="text-xs font-bold text-ink-600 uppercase tracking-wider">
          Recent Units
        </h3>
        <span className="text-[10px] font-bold text-ink-400 bg-ink-200 px-2 rounded-full">
          {units.length}
        </span>
      </div>
      
      <div className="overflow-y-auto flex-grow p-2 space-y-2">
        {units.length === 0 ? (
          <div className="p-8 text-center text-ink-400 text-sm italic">
            No units match the current filters.
          </div>
        ) : (
          units.map(unit => {
            const isSelected = unit.id === selectedUnitId;
            const config = getStateConfig(unit.currentState);
            
            return (
              <button
                key={unit.id}
                onClick={() => onSelect(unit.id)}
                className={`w-full text-left p-3 rounded-xl transition-all border ${
                  isSelected 
                    ? 'bg-ink-900 border-ink-800 shadow-md' 
                    : 'bg-white border-ink-100 hover:border-ink-300 hover:bg-ink-50/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`font-mono text-xs font-bold tracking-tight ${isSelected ? 'text-white' : 'text-ink-900'}`}>
                    {unit.id}
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${config.bg}`}>
                     <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                     {unit.currentState}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`text-sm font-editorial font-bold ${isSelected ? 'text-blood-400' : 'text-blood-700'}`}>
                    {unit.bloodGroup}
                  </div>
                  <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-ink-800 text-ink-300' : 'bg-ink-100 text-ink-600'}`}>
                    {unit.component}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
