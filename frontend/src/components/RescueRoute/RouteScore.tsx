import React from 'react';
import { RouteScoreDetails } from './routeEngine';

interface RouteScoreProps {
  details: RouteScoreDetails | null;
  isComposed: boolean;
}

export const RouteScore: React.FC<RouteScoreProps> = ({ details, isComposed }) => {
  const isHighFit = details && details.total >= 80;
  const isFeasible = details?.isFeasible;

  return (
    <div className="bg-ink-900 text-white rounded-lg p-5 mb-6 shadow-md relative overflow-hidden">
      {/* Decorative background element */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-colors duration-500 ${
        !isComposed ? 'bg-blood-800/20' : 
        !isFeasible ? 'bg-amber-600/20' :
        isHighFit ? 'bg-emerald-600/20' : 'bg-blood-600/30'
      }`}></div>
      
      <div className="flex items-end justify-between mb-2">
        <div className="flex flex-col">
          <h3 className="text-sm font-bold tracking-wider text-ink-300">ROUTE FIT</h3>
          {isComposed && details && (
            <span className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${
              !isFeasible ? 'text-amber-400' :
              isHighFit ? 'text-emerald-400' : 'text-blood-400'
            }`}>
              {!isFeasible ? 'Not Feasible' : isHighFit ? 'High Fit' : 'Moderate Fit'}
            </span>
          )}
        </div>
        <div className={`text-3xl font-editorial font-bold transition-colors ${
          !isComposed ? 'text-blood-400' :
          !isFeasible ? 'text-amber-500' : 'text-white'
        }`}>
          {isComposed && details ? details.isFeasible ? details.total : 'N/A' : '--'} 
          <span className="text-lg text-ink-500 font-sans"> / 100</span>
        </div>
      </div>
      <p className="text-xs text-ink-400 mb-6 italic">"Prototype logistics score"</p>
      
      <div className="grid grid-cols-5 gap-2">
        <div className="flex flex-col items-center justify-center bg-white/5 rounded p-2 text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-400 mb-1">Time</span>
          <span className={`text-sm font-semibold ${isComposed && details?.timeScore === 0 ? 'text-amber-400' : ''}`}>
            {isComposed && details ? details.timeScore : '--'}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center bg-white/5 rounded p-2 text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-400 mb-1">Stock</span>
          <span className={`text-sm font-semibold ${isComposed && details?.stockScore === 0 ? 'text-amber-400' : ''}`}>
            {isComposed && details ? details.stockScore : '--'}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center bg-white/5 rounded p-2 text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-400 mb-1">Expiry</span>
          <span className="text-sm font-semibold">{isComposed && details ? details.expiryScore : '--'}</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-white/5 rounded p-2 text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-400 mb-1">Risk</span>
          <span className="text-sm font-semibold">{isComposed && details ? details.riskScore : '--'}</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-white/5 rounded p-2 text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-400 mb-1">Dist</span>
          <span className="text-sm font-semibold">{isComposed && details ? details.distanceScore : '--'}</span>
        </div>
      </div>
    </div>
  );
};
