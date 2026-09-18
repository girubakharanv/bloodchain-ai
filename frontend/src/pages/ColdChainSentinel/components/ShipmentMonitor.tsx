import React from 'react';
import { Shipment } from '../../../data/coldChainData';
import { ArrowRight, Thermometer, Clock, Battery, Shield, Navigation } from 'lucide-react';

interface ShipmentMonitorProps {
  shipment: Shipment;
}

export const ShipmentMonitor: React.FC<ShipmentMonitorProps> = ({ shipment }) => {
  const isTempWarning = shipment.temperature > shipment.targetRangeMax || shipment.temperature < shipment.targetRangeMin;

  return (
    <div className="bg-white border border-ink-200/50 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      
      {/* Header */}
      <div className="bg-ink-900 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink-400">Active Transport</span>
          <h2 className="text-xl font-editorial font-bold text-white tracking-wide">{shipment.id}</h2>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
          shipment.routeStatus === 'IN TRANSIT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-ink-800 text-ink-300'
        }`}>
          {shipment.routeStatus === 'IN TRANSIT' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          {shipment.routeStatus}
        </div>
      </div>

      {/* Source/Destination */}
      <div className="px-6 py-5 border-b border-ink-100 flex items-center justify-between">
        <div className="flex flex-col max-w-[40%]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Source</span>
          <span className="font-semibold text-ink-900 truncate">{shipment.source}</span>
        </div>
        <ArrowRight className="w-5 h-5 text-ink-300 flex-shrink-0" />
        <div className="flex flex-col max-w-[40%] text-right">
          <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Destination</span>
          <span className="font-semibold text-ink-900 truncate">{shipment.destination}</span>
        </div>
      </div>

      {/* Core Monitoring Metrics */}
      <div className="p-6 flex-grow grid grid-cols-2 md:grid-cols-3 gap-6">
        
        {/* Temperature */}
        <div className="col-span-2 md:col-span-1 flex flex-col justify-center items-center p-4 bg-ink-50/50 rounded-xl border border-ink-100">
          <div className="flex items-center gap-1.5 text-ink-500 mb-2">
            <Thermometer className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Temperature</span>
          </div>
          <div className={`text-4xl font-editorial font-bold ${isTempWarning ? 'text-blood-600' : 'text-ink-900'}`}>
            {shipment.temperature.toFixed(1)}°C
          </div>
          <div className="text-xs text-ink-500 font-medium mt-1">
            Target Range: {shipment.targetRangeMin}°C – {shipment.targetRangeMax}°C
          </div>
        </div>

        {/* Other Metrics */}
        <div className="col-span-2 md:col-span-2 grid grid-cols-2 gap-4">
          
          <div className="flex flex-col justify-center p-3">
            <div className="flex items-center gap-1.5 text-ink-500 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Transport Time</span>
            </div>
            <span className="text-lg font-semibold text-ink-900">{shipment.transportTime}</span>
          </div>

          <div className="flex flex-col justify-center p-3">
            <div className="flex items-center gap-1.5 text-ink-500 mb-1">
              <Battery className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Battery</span>
            </div>
            <span className={`text-lg font-semibold ${shipment.battery < 20 ? 'text-blood-600' : 'text-ink-900'}`}>
              {shipment.battery}%
            </span>
          </div>

          <div className="flex flex-col justify-center p-3">
            <div className="flex items-center gap-1.5 text-ink-500 mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Door</span>
            </div>
            <span className={`text-lg font-semibold ${shipment.doorStatus !== 'SECURE' ? 'text-amber-600' : 'text-emerald-600'}`}>
              {shipment.doorStatus}
            </span>
          </div>

          <div className="flex flex-col justify-center p-3">
            <div className="flex items-center gap-1.5 text-ink-500 mb-1">
              <Navigation className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">GPS Signal</span>
            </div>
            <span className="text-lg font-semibold text-ink-900">
              {shipment.gpsStatus}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
