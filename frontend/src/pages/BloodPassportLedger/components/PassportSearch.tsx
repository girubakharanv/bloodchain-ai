import React from 'react';
import { Search, Filter } from 'lucide-react';

interface PassportSearchProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedGroup: string;
  setSelectedGroup: (val: string) => void;
  selectedState: string;
  setSelectedState: (val: string) => void;
  selectedSource: string;
  setSelectedSource: (val: string) => void;
}

export const PassportSearch: React.FC<PassportSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedGroup,
  setSelectedGroup,
  selectedState,
  setSelectedState,
  selectedSource,
  setSelectedSource
}) => {
  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-5 shadow-sm space-y-4">
      
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-ink-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-ink-300 rounded-lg focus:ring-blood-500 focus:border-blood-500 text-sm font-mono placeholder-ink-400"
          placeholder="Enter Unit ID (e.g. BC-O-POS...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
          <button className="bg-ink-100 hover:bg-ink-200 text-ink-600 text-[10px] font-bold tracking-wider px-2 py-1 rounded">
            SEARCH
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="pt-2 border-t border-ink-100 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Blood Group
          </label>
          <select 
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full text-xs border border-ink-200 rounded p-1.5 focus:border-blood-400 focus:ring-0 text-ink-700 font-medium"
          >
            {['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> State
          </label>
          <select 
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full text-xs border border-ink-200 rounded p-1.5 focus:border-blood-400 focus:ring-0 text-ink-700 font-medium"
          >
            {['All', 'COLLECTED', 'PROCESSING', 'STORED', 'ALLOCATED', 'DISPATCHED', 'IN TRANSIT', 'ARRIVED', 'EXPIRED', 'QUARANTINED'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-[10px] font-bold text-ink-500 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Source
          </label>
          <select 
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full text-xs border border-ink-200 rounded p-1.5 focus:border-blood-400 focus:ring-0 text-ink-700 font-medium"
          >
            {['All', 'Madurai', 'Chennai', 'Coimbatore', 'Trichy'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
};
