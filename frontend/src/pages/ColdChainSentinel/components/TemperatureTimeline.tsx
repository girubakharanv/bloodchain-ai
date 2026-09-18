import React from 'react';
import { Shipment } from '../../../data/coldChainData';

interface TemperatureTimelineProps {
  shipment: Shipment;
}

export const TemperatureTimeline: React.FC<TemperatureTimelineProps> = ({ shipment }) => {
  const { temperatureHistory, targetRangeMin, targetRangeMax } = shipment;

  if (!temperatureHistory || temperatureHistory.length === 0) {
    return (
      <div className="bg-white border border-ink-200/50 rounded-2xl p-6 shadow-sm h-64 flex items-center justify-center">
        <span className="text-ink-400 font-medium italic">No temperature history available.</span>
      </div>
    );
  }

  // Find min and max for scaling
  const minTemp = Math.min(...temperatureHistory.map(p => p.temp), targetRangeMin - 1);
  const maxTemp = Math.max(...temperatureHistory.map(p => p.temp), targetRangeMax + 1);
  const tempRange = maxTemp - minTemp;

  // Chart dimensions
  const height = 180;
  const padding = 20;
  const usableHeight = height - padding * 2;

  const getY = (temp: number) => {
    return height - padding - ((temp - minTemp) / tempRange) * usableHeight;
  };

  const getX = (index: number) => {
    return (index / (Math.max(1, temperatureHistory.length - 1))) * 100 + '%';
  };

  const isWarning = (temp: number) => temp > targetRangeMax || temp < targetRangeMin;

  return (
    <div className="bg-white border border-ink-200/50 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">Temperature History</h3>
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded bg-emerald-100 border border-emerald-200"></div>
            <span className="text-ink-500">Target Range</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-ink-900"></div>
            <span className="text-ink-500">Recorded</span>
          </div>
        </div>
      </div>

      <div className="relative flex-grow" style={{ minHeight: `${height}px` }}>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] font-medium text-ink-400 py-[20px] w-8">
          <span>{maxTemp.toFixed(1)}°</span>
          <span>{((maxTemp + minTemp) / 2).toFixed(1)}°</span>
          <span>{minTemp.toFixed(1)}°</span>
        </div>

        <div className="ml-10 relative h-full">
          {/* Target Range Band */}
          <div 
            className="absolute left-0 right-0 bg-emerald-50/50 border-y border-emerald-100/50 transition-all"
            style={{
              top: `${getY(targetRangeMax)}px`,
              height: `${getY(targetRangeMin) - getY(targetRangeMax)}px`
            }}
          />

          {/* Grid lines */}
          <div className="absolute left-0 right-0 top-[20px] border-t border-ink-100 border-dashed" />
          <div className="absolute left-0 right-0 top-1/2 border-t border-ink-100 border-dashed" />
          <div className="absolute left-0 right-0 bottom-[20px] border-t border-ink-100 border-dashed" />

          {/* SVG Chart Line */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
            <polyline 
              fill="none" 
              stroke="#1C1917" // ink-900
              strokeWidth="2"
              points={temperatureHistory.map((p, i) => `${(i / (Math.max(1, temperatureHistory.length - 1))) * 100},${getY(p.temp)}`).join(' ')}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Data Points */}
          {temperatureHistory.map((point, i) => (
            <div 
              key={i}
              className={`absolute w-3 h-3 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 transition-colors ${
                isWarning(point.temp) ? 'bg-blood-500 border-white' : 'bg-ink-900 border-white'
              }`}
              style={{
                left: getX(i),
                top: `${getY(point.temp)}px`
              }}
              title={`${point.temp}°C at ${point.time}`}
            >
              {/* Tooltip on hover (simple native title used above, could be custom if needed) */}
            </div>
          ))}

          {/* X-axis labels */}
          <div className="absolute left-0 right-0 -bottom-6 flex justify-between text-[10px] font-medium text-ink-400">
            {temperatureHistory.map((point, i) => {
              // Show first, last, and maybe some in between
              if (i === 0 || i === temperatureHistory.length - 1 || i === Math.floor(temperatureHistory.length / 2)) {
                return <span key={i} className="transform -translate-x-1/2" style={{ position: 'absolute', left: getX(i) }}>{point.time}</span>
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
