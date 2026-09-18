import React from 'react';
import { ForecastPoint } from '../../../data/collectionCompassData';

interface ForecastChartProps {
  points: ForecastPoint[];
  horizon: number;
  isSimulationMode: boolean;
  demandModifier: number;
  inventoryModifier: number;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ 
  points, 
  horizon, 
  isSimulationMode,
  demandModifier,
  inventoryModifier
}) => {
  // We only show points up to the selected horizon
  const displayPoints = points.filter(p => p.hoursOffset <= horizon);
  if (displayPoints.length === 0) return null;

  // Calculate simulated values
  const simulatedPoints = displayPoints.map(p => ({
    ...p,
    forecastDemand: p.forecastDemand * (1 + (demandModifier / 100)),
    currentStockProjection: p.currentStockProjection * (1 + (inventoryModifier / 100))
  }));

  const maxValOriginal = Math.max(
    ...displayPoints.map(p => Math.max(p.forecastDemand, p.currentStockProjection)), 10
  );
  
  const maxValSimulated = Math.max(
    ...simulatedPoints.map(p => Math.max(p.forecastDemand, p.currentStockProjection)), 10
  );

  const maxVal = Math.max(maxValOriginal, maxValSimulated);

  return (
    <div className={`bg-white border ${isSimulationMode ? 'border-amber-200' : 'border-ink-200/50'} rounded-2xl shadow-sm overflow-hidden h-[300px] flex flex-col transition-colors duration-500`}>
      <div className={`px-6 py-4 border-b flex justify-between items-center transition-colors ${isSimulationMode ? 'bg-amber-50 border-amber-200' : 'bg-ink-50/50 border-ink-100'}`}>
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">
          {isSimulationMode ? 'Simulated Forecast vs Stock' : 'Forecast vs Projected Stock'}
        </h3>
        {isSimulationMode && <span className="text-[9px] font-bold tracking-widest text-amber-500 uppercase">Simulated</span>}
      </div>
      
      <div className="flex-grow p-6 relative">
        <div className="absolute inset-y-6 left-6 right-6">
          {/* Y Axis Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
            <div key={i} className="absolute w-full border-t border-ink-100 border-dashed" style={{ bottom: `${pct * 100}%` }}>
              <span className="absolute -left-6 -translate-y-1/2 text-[9px] text-ink-400 font-mono">
                {Math.round(maxVal * pct)}
              </span>
            </div>
          ))}

          {/* SVG Lines */}
          <svg className="absolute inset-0 w-full h-full overflow-visible transition-all duration-700" preserveAspectRatio="none">
            
            {/* BASELINE LINES (Faded out if simulation is active) */}
            <polyline 
              fill="none" 
              stroke="#059669" 
              strokeWidth="2" 
              opacity={isSimulationMode ? 0.2 : 1}
              points={displayPoints.map((p, i) => {
                const x = (i / (displayPoints.length - 1 || 1)) * 100;
                const y = 100 - (p.currentStockProjection / maxVal) * 100;
                return `${x}%,${y}%`;
              }).join(' ')} 
            />
            <polyline 
              fill="none" 
              stroke="#dc2626" 
              strokeWidth="2" 
              strokeDasharray="4 4"
              opacity={isSimulationMode ? 0.2 : 1}
              points={displayPoints.map((p, i) => {
                const x = (i / (displayPoints.length - 1 || 1)) * 100;
                const y = 100 - (p.forecastDemand / maxVal) * 100;
                return `${x}%,${y}%`;
              }).join(' ')} 
            />

            {/* SIMULATED LINES (Only visible if simulation is active) */}
            {isSimulationMode && (
              <>
                <polyline 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="3" 
                  points={simulatedPoints.map((p, i) => {
                    const x = (i / (simulatedPoints.length - 1 || 1)) * 100;
                    const y = 100 - (p.currentStockProjection / maxVal) * 100;
                    return `${x}%,${y}%`;
                  }).join(' ')} 
                />
                <polyline 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="3" 
                  strokeDasharray="4 4"
                  points={simulatedPoints.map((p, i) => {
                    const x = (i / (simulatedPoints.length - 1 || 1)) * 100;
                    const y = 100 - (p.forecastDemand / maxVal) * 100;
                    return `${x}%,${y}%`;
                  }).join(' ')} 
                />
              </>
            )}
          </svg>

          {/* X Axis Labels & Points */}
          {displayPoints.map((p, i) => {
            const x = (i / (displayPoints.length - 1 || 1)) * 100;
            const yStock = 100 - (isSimulationMode ? simulatedPoints[i].currentStockProjection : p.currentStockProjection) / maxVal * 100;
            const yDemand = 100 - (isSimulationMode ? simulatedPoints[i].forecastDemand : p.forecastDemand) / maxVal * 100;
            return (
              <React.Fragment key={p.hoursOffset}>
                <div 
                  className={`absolute w-2 h-2 rounded-full ${isSimulationMode ? 'bg-emerald-500' : 'bg-emerald-600'} border-2 border-white shadow-sm transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700`} 
                  style={{ left: `${x}%`, top: `${yStock}%` }} 
                />
                <div 
                  className={`absolute w-2 h-2 rounded-full ${isSimulationMode ? 'bg-amber-500' : 'bg-blood-600'} border-2 border-white shadow-sm transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700`} 
                  style={{ left: `${x}%`, top: `${yDemand}%` }} 
                />
                <div 
                  className="absolute bottom-[-24px] transform -translate-x-1/2 text-[9px] font-bold text-ink-500 font-mono" 
                  style={{ left: `${x}%` }}
                >
                  +{p.hoursOffset}h
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className={`px-6 py-3 border-t flex gap-6 text-[10px] font-bold uppercase tracking-wider justify-center transition-colors ${isSimulationMode ? 'border-amber-200 bg-amber-50/50 text-amber-700' : 'border-ink-100 bg-white text-ink-500'}`}>
        <div className="flex items-center gap-2"><div className={`w-3 h-0.5 ${isSimulationMode ? 'bg-emerald-500' : 'bg-emerald-600'}`} /> {isSimulationMode ? 'Sim. Stock' : 'Projected Stock'}</div>
        <div className="flex items-center gap-2"><div className={`w-3 h-0.5 border-t-2 border-dashed ${isSimulationMode ? 'border-amber-500' : 'border-blood-600'}`} /> {isSimulationMode ? 'Sim. Demand' : 'Forecast Demand'}</div>
        {isSimulationMode && (
          <div className="flex items-center gap-2 text-ink-400"><div className="w-3 h-0.5 border-t-2 border-dashed border-ink-300" /> Baseline</div>
        )}
      </div>
    </div>
  );
};
