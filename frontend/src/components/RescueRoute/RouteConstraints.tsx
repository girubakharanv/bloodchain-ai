import React from 'react';
import { RouteConstraint } from '../../data/routeData';
import { Clock, Navigation, Thermometer, Box, CalendarClock } from 'lucide-react';

interface RouteConstraintsProps {
  constraints: RouteConstraint;
}

export const RouteConstraints: React.FC<RouteConstraintsProps> = ({ constraints }) => {
  return (
    <div className="bg-white border border-ink-200/50 rounded-lg p-4 mb-6 shadow-sm">
      <h3 className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-4">Logistics Constraints</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-ink-500 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Time Window</span>
          </div>
          <span className="text-sm font-semibold text-ink-900">{constraints.timeWindow}</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-ink-500 mb-1">
            <Navigation className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Distance</span>
          </div>
          <span className="text-sm font-semibold text-ink-900">{constraints.distance}</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-ink-500 mb-1">
            <Thermometer className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Temperature</span>
          </div>
          <span className="text-sm font-semibold text-ink-900">{constraints.temperature}</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-ink-500 mb-1">
            <Box className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Quantity</span>
          </div>
          <span className="text-sm font-semibold text-ink-900">{constraints.quantity}</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-ink-500 mb-1">
            <CalendarClock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Expiry Window</span>
          </div>
          <span className="text-sm font-semibold text-ink-900">{constraints.expiryWindow}</span>
        </div>
      </div>
    </div>
  );
};
