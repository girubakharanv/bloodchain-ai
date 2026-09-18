import React from 'react';
import { RouteOption as IRouteOption } from '../../data/routeData';
import { Shield, Clock, Map as MapIcon, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { RouteScoreDetails } from './routeEngine';

interface RouteOptionProps {
  option: IRouteOption;
  isSelected: boolean;
  onClick: () => void;
  details?: RouteScoreDetails;
  isBest?: boolean;
  isComposed: boolean;
}

export const RouteOption: React.FC<RouteOptionProps> = ({ option, isSelected, onClick, details, isBest, isComposed }) => {
  
  let statusText = 'AVAILABLE';
  let StatusIcon = null;
  let statusClass = 'bg-ink-100 text-ink-600';

  if (isComposed && details) {
    if (!details.isFeasible) {
      statusText = 'NOT FEASIBLE';
      StatusIcon = AlertCircle;
      statusClass = 'bg-amber-100 text-amber-800';
    } else if (isBest) {
      statusText = 'RECOMMENDED';
      StatusIcon = CheckCircle2;
      statusClass = 'bg-blood-100 text-blood-800';
    } else {
      statusText = 'ALTERNATIVE';
      statusClass = 'bg-emerald-50 text-emerald-700';
    }
  }

  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border p-4 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'bg-blood-50 border-blood-200 shadow-md transform scale-[1.01]' 
          : 'bg-white border-ink-200/50 hover:border-blood-200 hover:shadow-sm'
      }`}
    >
      {/* Selection indicator line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${isSelected ? 'bg-blood-600' : 'bg-transparent'}`} />

      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <h4 className={`font-bold text-sm ${isSelected ? 'text-blood-900' : 'text-ink-900'}`}>
            {option.name} <span className="text-ink-400 font-normal">| {option.sourceName}</span>
          </h4>
          {isComposed && details && (
            <span className="text-[10px] uppercase font-bold text-ink-500 mt-1">
              Score: <span className={details.isFeasible ? 'text-blood-600' : 'text-amber-600'}>
                {details.isFeasible ? `${details.total}/100` : 'N/A'}
              </span>
            </span>
          )}
        </div>
        <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1 ${statusClass}`}>
          {StatusIcon && <StatusIcon className="w-3 h-3" />}
          {statusText}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 text-xs mt-2">
        <div className="flex flex-col">
          <div className="text-ink-500 mb-1 flex items-center gap-1.5">
            <MapIcon className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider text-[10px] font-bold">Dist</span>
          </div>
          <span className="font-semibold text-ink-900">{option.distanceKm} km</span>
        </div>
        
        <div className="flex flex-col">
          <div className="text-ink-500 mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider text-[10px] font-bold">Time</span>
          </div>
          <span className="font-semibold text-ink-900">{option.travelTimeMinutes} min</span>
        </div>

        <div className="flex flex-col">
          <div className="text-ink-500 mb-1 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider text-[10px] font-bold">Risk</span>
          </div>
          <span className={`font-semibold ${
            option.risk === 'LOW' ? 'text-emerald-600' : 
            option.risk === 'MEDIUM' ? 'text-amber-600' : 'text-blood-600'
          }`}>
            {option.risk}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="text-ink-500 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider text-[10px] font-bold">Expiry</span>
          </div>
          <span className="font-semibold text-ink-900">{option.expiryHours}h</span>
        </div>
      </div>
    </div>
  );
};
