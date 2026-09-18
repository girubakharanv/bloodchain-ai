import React from 'react';
import type { BloodUnit } from '../../../data/bloodUnits';
import { Clock } from 'lucide-react';

interface ExpiryEchoVisualProps {
  units: (BloodUnit & { simulatedRisk: number; simulatedUtilization: string })[];
  selectedUnitId: string | null;
  onSelectUnit: (id: string) => void;
}

export const ExpiryEchoVisual: React.FC<ExpiryEchoVisualProps> = ({ units, selectedUnitId, onSelectUnit }) => {
  // Sort units to prevent overlap or just position them based on hours remaining
  // We'll show a sample of up to 30 units so it doesn't get overcrowded.
  const displayUnits = units.slice(0, 30);

  return (
    <div className="bg-white border border-ink-200/40 rounded shadow-sm p-6 flex flex-col h-[400px]">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-editorial font-bold text-ink-900 flex items-center gap-2">
            Expiry Echo <div className="w-2 h-2 bg-blood-600 rounded-full animate-pulse" />
          </h2>
          <p className="text-sm text-ink-500">Projected unit utilization against remaining shelf life.</p>
        </div>
      </div>

      {/* Interactive Timeline Area */}
      <div className="flex-1 relative border-b-2 border-ink-200 mt-8 mb-4">
        {/* Time Axis Labels */}
        <div className="absolute -top-6 left-0 text-xs font-bold text-ink-400">NOW</div>
        <div className="absolute -top-6 left-[33%] text-xs font-bold text-ink-400">24H</div>
        <div className="absolute -top-6 left-[66%] text-xs font-bold text-ink-400">48H</div>
        <div className="absolute -top-6 right-0 text-xs font-bold text-blood-600">EXPIRY</div>

        {/* Axis Guidelines */}
        <div className="absolute inset-y-0 left-[33%] w-px bg-ink-200 border-l border-dashed" />
        <div className="absolute inset-y-0 left-[66%] w-px bg-ink-200 border-l border-dashed" />
        <div className="absolute inset-y-0 right-0 w-px bg-blood-200 border-l border-dashed" />

        {/* Units */}
        <div className="absolute inset-0 overflow-visible mt-4">
          {displayUnits.map((unit, idx) => {
            // Position based on hours remaining (max 72 for visual bounds, though data might go to 168)
            // We'll cap visual at 72 hours for the main echo range, clamping for display
            const visualHours = Math.max(0, Math.min(72, unit.hoursRemaining));
            const leftPercentage = 100 - (visualHours / 72) * 100;
            
            // Stagger vertically
            const topPercentage = 10 + (idx % 6) * 15;
            
            const isSelected = selectedUnitId === unit.id;
            const isDimmed = selectedUnitId && !isSelected;
            
            let colorClass = "bg-ink-300 border-ink-400";
            if (unit.simulatedRisk > 80) colorClass = "bg-blood-500 border-blood-700 shadow-[0_0_8px_rgba(239,68,68,0.5)]";
            else if (unit.simulatedRisk > 50) colorClass = "bg-orange-400 border-orange-600";

            return (
              <div 
                key={unit.id}
                onClick={() => onSelectUnit(unit.id)}
                className={`absolute w-3 h-8 rounded-full border cursor-pointer transition-all duration-500 transform ${colorClass} ${isSelected ? 'scale-150 z-10' : 'hover:scale-125 z-0'} ${isDimmed ? 'opacity-20 grayscale' : 'opacity-100'}`}
                style={{ 
                  left: `${leftPercentage}%`, 
                  top: `${topPercentage}%`,
                  marginLeft: '-6px'
                }}
                title={`Unit ${unit.id} | ${unit.hoursRemaining}h remaining | Risk: ${unit.simulatedRisk}`}
              >
                {/* Tooltip on hover */}
                <div className="hidden hover:block absolute -top-12 left-1/2 -translate-x-1/2 bg-ink-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50">
                  {unit.id} • {unit.hoursRemaining}h
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-ink-500">
        <div className="flex gap-4">
           <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blood-500" /> High Risk</div>
           <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-400" /> Watch</div>
           <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-ink-300" /> Safe</div>
        </div>
        <div>Expiry reached — follow authorized blood-bank disposition procedures.</div>
      </div>
    </div>
  );
};
