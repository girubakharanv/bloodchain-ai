import React from 'react';
import { Shipment } from '../../../data/coldChainData';
import { Thermometer, Shield, Battery, Navigation, Activity } from 'lucide-react';

interface SensorStatusProps {
  shipment: Shipment;
}

export const SensorStatus: React.FC<SensorStatusProps> = ({ shipment }) => {
  const isTempWarning = shipment.temperature > shipment.targetRangeMax || shipment.temperature < shipment.targetRangeMin;

  const sensors = [
    {
      name: 'Temperature',
      status: isTempWarning ? 'WATCH' : 'ONLINE',
      isWarning: isTempWarning,
      icon: Thermometer,
      update: '12 sec ago'
    },
    {
      name: 'Door Sensor',
      status: shipment.doorStatus,
      isWarning: shipment.doorStatus !== 'SECURE',
      icon: Shield,
      update: '8 sec ago'
    },
    {
      name: 'Battery',
      status: `${shipment.battery}%`,
      isWarning: shipment.battery < 20,
      icon: Battery,
      update: '1 min ago'
    },
    {
      name: 'GPS',
      status: shipment.gpsStatus,
      isWarning: shipment.gpsStatus !== 'CONNECTED',
      icon: Navigation,
      update: '4 sec ago'
    },
    {
      name: 'Device',
      status: shipment.deviceStatus,
      isWarning: shipment.deviceStatus !== 'HEALTHY',
      icon: Activity,
      update: '5 min ago'
    }
  ];

  return (
    <div className="bg-white border border-ink-200/50 rounded-2xl p-6 shadow-sm">
      <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider mb-4">Sensor Array</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {sensors.map((sensor, idx) => {
          const Icon = sensor.icon;
          return (
            <div key={idx} className={`p-3 rounded-xl border flex flex-col ${
              sensor.isWarning ? 'bg-amber-50 border-amber-200' : 'bg-ink-50/50 border-ink-100'
            }`}>
              <div className="flex items-center gap-1.5 text-ink-500 mb-2">
                <Icon className={`w-3.5 h-3.5 ${sensor.isWarning ? 'text-amber-600' : ''}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider truncate">{sensor.name}</span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  sensor.isWarning ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                }`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  sensor.isWarning ? 'text-amber-700' : 'text-ink-900'
                }`}>
                  {sensor.status}
                </span>
              </div>
              <span className="text-[10px] text-ink-400">{sensor.update}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
