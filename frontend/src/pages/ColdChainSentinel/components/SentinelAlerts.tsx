import React from 'react';
import { SentinelAlert } from '../../../data/coldChainData';
import { AlertTriangle, Info, BellRing } from 'lucide-react';

interface SentinelAlertsProps {
  alerts: SentinelAlert[];
}

export const SentinelAlerts: React.FC<SentinelAlertsProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white border border-ink-200/50 rounded-2xl shadow-sm overflow-hidden h-full">
        <div className="px-6 py-4 border-b border-ink-100 bg-ink-50/50">
          <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">Sentinel Alerts</h3>
        </div>
        <div className="p-6 flex items-center justify-center text-ink-400 italic text-sm">
          No operational alerts present.
        </div>
      </div>
    );
  }

  const getAlertStyle = (type: string) => {
    if (type.includes('WATCH')) return 'bg-amber-50 border-amber-200 text-amber-900';
    if (type.includes('EVENT')) return 'bg-blood-50 border-blood-200 text-blood-900';
    return 'bg-ink-50 border-ink-200 text-ink-900';
  };

  const getAlertIcon = (type: string) => {
    if (type.includes('WATCH')) return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    if (type.includes('EVENT')) return <BellRing className="w-4 h-4 text-blood-600" />;
    return <Info className="w-4 h-4 text-ink-600" />;
  };

  return (
    <div className="bg-white border border-ink-200/50 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-ink-100 bg-ink-50/50 flex justify-between items-center">
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider flex items-center gap-2">
          Sentinel Alerts
          <span className="bg-blood-100 text-blood-800 text-[10px] px-1.5 py-0.5 rounded-full">{alerts.length}</span>
        </h3>
      </div>
      
      <div className="p-4 flex-grow overflow-y-auto space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-4 rounded-xl border flex items-start gap-3 ${getAlertStyle(alert.type)}`}>
            <div className="mt-0.5 flex-shrink-0">
              {getAlertIcon(alert.type)}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-80">
                {alert.type}
              </span>
              <p className="text-sm font-medium leading-snug">
                {alert.message}
              </p>
              <span className="text-[10px] font-bold mt-2 opacity-60 uppercase tracking-wider">
                Operational review required.
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
