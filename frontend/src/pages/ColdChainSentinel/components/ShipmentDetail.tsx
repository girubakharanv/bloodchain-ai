import React from 'react';
import { Shipment } from '../../../data/coldChainData';
import { Activity, Shield, Battery, Map, AlertTriangle } from 'lucide-react';
import { SentinelScoreDetails } from '../utils/sentinelRiskEngine';

interface ShipmentDetailProps {
  shipment: Shipment;
  scoreDetails?: SentinelScoreDetails;
}

export const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipment, scoreDetails }) => {
  const isTempWarning = shipment.temperature > shipment.targetRangeMax || shipment.temperature < shipment.targetRangeMin;
  const tempTrend = scoreDetails ? scoreDetails.temperatureTrendText : (isTempWarning ? 'FLUCTUATING' : 'STABLE');
  
  // Use the engine's computed risk level if available, fallback to mock data
  const riskStatus = scoreDetails ? scoreDetails.riskLevel : shipment.riskStatus;

  return (
    <div className="bg-white border border-ink-200/50 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-ink-100 bg-ink-50/50">
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">Shipment Intelligence</h3>
      </div>
      
      <div className="p-6 flex-grow space-y-6">
        
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1 block">Shipment ID</span>
          <span className="text-lg font-editorial font-bold text-ink-900">{shipment.id}</span>
        </div>

        <div className="h-px bg-ink-100 w-full" />

        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Temperature</span>
            <span className={`font-semibold ${isTempWarning ? 'text-blood-600' : 'text-ink-900'}`}>
              {shipment.temperature.toFixed(1)}°C
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Trend</span>
            <span className={`font-semibold flex items-center gap-1.5 ${
              tempTrend === 'RISING' || tempTrend === 'FALLING' ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              <Activity className="w-3.5 h-3.5" />
              {tempTrend}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Door</span>
            <span className={`font-semibold flex items-center gap-1.5 ${shipment.doorStatus !== 'SECURE' ? 'text-amber-600' : 'text-ink-900'}`}>
              <Shield className="w-3.5 h-3.5" />
              {shipment.doorStatus}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Battery</span>
            <span className={`font-semibold flex items-center gap-1.5 ${shipment.battery < 20 ? 'text-blood-600' : 'text-ink-900'}`}>
              <Battery className="w-3.5 h-3.5" />
              {shipment.battery}%
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Transport Time</span>
            <span className="font-semibold text-ink-900">
              {shipment.transportTime}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400 mb-1">Route Status</span>
            <span className="font-semibold flex items-center gap-1.5 text-ink-900">
              <Map className="w-3.5 h-3.5 text-ink-500" />
              {shipment.routeStatus}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-ink-100 flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-ink-400">Risk State</span>
          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1.5 ${
            riskStatus === 'CRITICAL' || riskStatus === 'HIGH' ? 'bg-blood-100 text-blood-800' :
            riskStatus === 'WATCH' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {(riskStatus === 'WATCH' || riskStatus === 'HIGH' || riskStatus === 'CRITICAL') && <AlertTriangle className="w-3 h-3" />}
            {riskStatus}
          </span>
        </div>

      </div>
    </div>
  );
};
