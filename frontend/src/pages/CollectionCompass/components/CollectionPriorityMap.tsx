import React from 'react';
import { MapPin, AlertCircle } from 'lucide-react';

interface PriorityMapProps {
  regionData: { name: string; priority: string; score: number }[];
  selectedRegion: string;
  onSelect: (region: string) => void;
}

export const CollectionPriorityMap: React.FC<PriorityMapProps> = ({ regionData, selectedRegion, onSelect }) => {
  
  // Minimal abstract geographic visualization for demo regions
  const mapNodes = [
    { name: 'Chennai', top: '15%', left: '80%' },
    { name: 'Salem', top: '35%', left: '55%' },
    { name: 'Coimbatore', top: '50%', left: '30%' },
    { name: 'Trichy', top: '55%', left: '65%' },
    { name: 'Madurai', top: '75%', left: '50%' },
    { name: 'Tirunelveli', top: '90%', left: '45%' },
  ];

  const getColorByPriority = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-blood-700 shadow-[0_0_15px_rgba(185,28,28,0.5)] border-white';
      case 'HIGH': return 'bg-blood-500 shadow-[0_0_10px_rgba(239,68,68,0.4)] border-white';
      case 'WATCH': return 'bg-amber-500 border-white';
      case 'LOW': return 'bg-emerald-500 border-white';
      default: return 'bg-ink-300 border-white';
    }
  };

  return (
    <div className="bg-ink-900 border border-ink-800 rounded-2xl shadow-sm overflow-hidden h-[450px] relative">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] bg-[size:20px_20px]" />
      
      <div className="px-6 py-4 border-b border-ink-800/50 flex justify-between items-center relative z-10">
        <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider">Regional Priority Map</h3>
        <MapPin className="w-4 h-4 text-ink-500" />
      </div>
      
      <div className="relative w-full h-[calc(100%-60px)]">
        {/* Simple connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
           <path d="M 80% 15% L 65% 55% L 50% 75% L 45% 90%" stroke="white" strokeWidth="2" fill="none" />
           <path d="M 65% 55% L 55% 35% L 30% 50%" stroke="white" strokeWidth="2" fill="none" />
        </svg>

        {mapNodes.map((node) => {
          const data = regionData.find(r => r.name === node.name);
          const priority = data?.priority || 'LOW';
          const isSelected = selectedRegion === node.name;
          const isHigh = priority === 'HIGH' || priority === 'CRITICAL';
          
          return (
            <div 
              key={node.name}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ top: node.top, left: node.left }}
              onClick={() => onSelect(node.name)}
            >
              <div className="relative">
                {isHigh && (
                  <div className="absolute -inset-2 bg-blood-500/20 rounded-full animate-ping pointer-events-none" />
                )}
                <div className={`w-4 h-4 rounded-full border-2 transition-transform ${getColorByPriority(priority)} ${isSelected ? 'scale-150' : 'group-hover:scale-125'}`} />
                
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-ink-900/90 backdrop-blur px-2 py-1 rounded border border-ink-800 pointer-events-none flex flex-col items-center">
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${isSelected ? 'text-white' : 'text-ink-300'}`}>
                    {node.name}
                  </span>
                  <span className={`text-[9px] font-bold tracking-wider uppercase ${
                    isHigh ? 'text-blood-400' : priority === 'WATCH' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {priority}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="absolute bottom-4 left-4 flex gap-3 text-[10px] font-bold uppercase tracking-wider text-ink-500 bg-ink-900/80 backdrop-blur px-3 py-1.5 rounded border border-ink-800">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blood-600" /> High</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> Watch</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Low</div>
      </div>
    </div>
  );
};
