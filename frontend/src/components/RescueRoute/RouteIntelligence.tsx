import React from 'react';
import { RouteRequest, RouteOption } from '../../data/routeData';
import { ArrowRight, RotateCcw, Activity, Settings2 } from 'lucide-react';
import { WhatIfModifiers, RouteScoreDetails } from './routeEngine';

interface RouteIntelligenceProps {
  request: RouteRequest;
  isComposed: boolean;
  onCompose: () => void;
  onReset: () => void;
  whatIfModifiers: WhatIfModifiers;
  setWhatIfModifiers: React.Dispatch<React.SetStateAction<WhatIfModifiers>>;
  selectedRouteObj: RouteOption | null;
  selectedDetails: RouteScoreDetails | null;
  bestRoute: RouteOption | null;
}

export const RouteIntelligence: React.FC<RouteIntelligenceProps> = ({ 
  request, 
  isComposed, 
  onCompose, 
  onReset,
  whatIfModifiers,
  setWhatIfModifiers,
  selectedRouteObj,
  selectedDetails,
  bestRoute
}) => {

  const handleModifierChange = (key: keyof WhatIfModifiers, value: number) => {
    setWhatIfModifiers(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white border border-ink-200/50 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-ink-100 flex items-center justify-between bg-ink-50/50">
        <h2 className="text-lg font-editorial font-bold text-ink-900">ROUTE INTELLIGENCE</h2>
        <div className="flex items-center gap-2 text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {isComposed ? 'COMPOSED' : 'READY'}
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col space-y-6">
        
        {/* Source & Destination Summary */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex flex-col max-w-[45%]">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Source</span>
            <span className={`font-semibold ${isComposed && selectedRouteObj ? 'text-blood-700' : 'text-ink-900'}`}>
              {isComposed && selectedRouteObj ? selectedRouteObj.sourceName : request.source?.name}
            </span>
          </div>
          
          <ArrowRight className="text-ink-300 w-5 h-5 flex-shrink-0" />
          
          <div className="flex flex-col items-end max-w-[45%] text-right">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Destination</span>
            <span className="font-semibold text-ink-900">{request.destination.name}</span>
          </div>
        </div>

        <div className="h-px bg-ink-100 w-full" />

        {/* Intelligence Data Grid */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Blood</span>
            <span className="font-semibold text-blood-700">{request.destination.bloodType} / {request.destination.productType}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Quantity</span>
            <span className="font-semibold text-ink-900">{request.destination.requestedUnits} units</span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Urgency</span>
            <span className="font-semibold text-blood-600 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              HIGH
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Est. Travel</span>
            <span className="font-semibold text-ink-900">
              {isComposed && selectedRouteObj ? `${selectedRouteObj.travelTimeMinutes + whatIfModifiers.transportAddedMin} min` : '--'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Route Risk</span>
            <span className="font-semibold text-ink-900">
              {isComposed && selectedRouteObj ? selectedRouteObj.risk : '--'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Rescue Window</span>
            <span className="font-semibold text-ink-900">
              {request.destination.timeConstraintText}
            </span>
          </div>
        </div>

        {/* TEST ROUTE (What If Controls) */}
        {isComposed && (
          <div className="mt-4 pt-4 border-t border-ink-100">
            <div className="flex items-center gap-2 mb-3">
              <Settings2 className="w-4 h-4 text-ink-500" />
              <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">TEST ROUTE</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => handleModifierChange('transportAddedMin', whatIfModifiers.transportAddedMin === 30 ? 0 : 30)}
                className={`p-2 border rounded text-left transition-colors ${whatIfModifiers.transportAddedMin === 30 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-white border-ink-200 hover:bg-ink-50'}`}
              >
                Transport +30 min
              </button>
              <button 
                onClick={() => handleModifierChange('transportAddedMin', whatIfModifiers.transportAddedMin === 60 ? 0 : 60)}
                className={`p-2 border rounded text-left transition-colors ${whatIfModifiers.transportAddedMin === 60 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-white border-ink-200 hover:bg-ink-50'}`}
              >
                Transport +60 min
              </button>
              <button 
                onClick={() => handleModifierChange('stockReducedUnits', whatIfModifiers.stockReducedUnits === 5 ? 0 : 5)}
                className={`p-2 border rounded text-left transition-colors ${whatIfModifiers.stockReducedUnits === 5 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-white border-ink-200 hover:bg-ink-50'}`}
              >
                Stock -5 units
              </button>
              <button 
                onClick={() => handleModifierChange('expiryReducedHours', whatIfModifiers.expiryReducedHours === 12 ? 0 : 12)}
                className={`p-2 border rounded text-left transition-colors ${whatIfModifiers.expiryReducedHours === 12 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-white border-ink-200 hover:bg-ink-50'}`}
              >
                Expiry -12 hours
              </button>
            </div>
            
            {(whatIfModifiers.transportAddedMin > 0 || whatIfModifiers.stockReducedUnits > 0 || whatIfModifiers.expiryReducedHours > 0) && (
              <div className="mt-3 text-[10px] text-amber-700 bg-amber-50 p-2 rounded italic">
                Modifiers applied. Route fit recalculated dynamically.
              </div>
            )}
          </div>
        )}

      </div>

      {/* Action Buttons */}
      <div className="p-5 border-t border-ink-100 bg-ink-50/50 flex flex-col gap-3">
        {isComposed && bestRoute && (
          <div className="text-center text-xs font-bold text-blood-700 mb-2 uppercase tracking-wider">
            RECOMMENDED: {bestRoute.sourceName}
          </div>
        )}
        <div className="flex gap-3">
          <button 
            onClick={onReset}
            className="flex items-center justify-center p-3 border border-ink-200 rounded-lg text-ink-600 hover:bg-ink-100 hover:text-ink-900 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onCompose}
            className={`flex-grow py-3 px-4 rounded-lg font-bold text-sm text-white transition-all ${
              isComposed 
                ? 'bg-ink-800 hover:bg-ink-900 shadow-md'
                : 'bg-blood-700 hover:bg-blood-800 shadow-md hover:shadow-lg'
            }`}
          >
            {isComposed ? 'RECALCULATE' : 'COMPOSE ROUTE'}
          </button>
        </div>
      </div>
    </div>
  );
};
