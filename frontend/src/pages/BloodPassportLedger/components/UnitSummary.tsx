import React from 'react';
import { BloodUnit } from '../data/bloodPassportData';
import { Fingerprint, Droplet, Clock, MapPin, Truck, Ban, AlertCircle, Box } from 'lucide-react';
import { VerificationResult } from '../utils/ledgerIntegrityEngine';

interface UnitSummaryProps {
  unit: BloodUnit;
  verificationResult: VerificationResult | null;
}

const getStateConfig = (state: string) => {
  switch(state) {
    case 'COLLECTED': return { bg: 'bg-emerald-50 text-emerald-700', icon: Droplet, dot: 'bg-emerald-500' };
    case 'PROCESSING': return { bg: 'bg-sky-50 text-sky-700', icon: Box, dot: 'bg-sky-500' };
    case 'STORED': return { bg: 'bg-indigo-50 text-indigo-700', icon: Box, dot: 'bg-indigo-500' };
    case 'ALLOCATED': return { bg: 'bg-purple-50 text-purple-700', icon: MapPin, dot: 'bg-purple-500' };
    case 'DISPATCHED': return { bg: 'bg-amber-50 text-amber-700', icon: Truck, dot: 'bg-amber-500' };
    case 'IN TRANSIT': return { bg: 'bg-amber-100 text-amber-800 border-amber-200 border', icon: Truck, dot: 'bg-amber-600 animate-pulse' };
    case 'ARRIVED': return { bg: 'bg-emerald-100 text-emerald-800', icon: MapPin, dot: 'bg-emerald-600' };
    case 'EXPIRED': return { bg: 'bg-ink-100 text-ink-600 border border-ink-300', icon: AlertCircle, dot: 'bg-ink-500' };
    case 'QUARANTINED': return { bg: 'bg-blood-50 text-blood-700 border border-blood-200', icon: Ban, dot: 'bg-blood-500' };
    default: return { bg: 'bg-ink-100 text-ink-600', icon: Box, dot: 'bg-ink-400' };
  }
};

export const UnitSummary: React.FC<UnitSummaryProps> = ({ unit, verificationResult }) => {
  const stateConfig = getStateConfig(unit.currentState);
  const StateIcon = stateConfig.icon;
  const isInvalid = verificationResult?.valid === false;

  return (
    <div className="bg-white border border-ink-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
      {/* Identity Column */}
      <div className={`text-white p-6 md:w-1/3 flex flex-col justify-between relative overflow-hidden transition-colors duration-500 ${isInvalid ? 'bg-amber-900' : 'bg-ink-900'}`}>
        <div className={`absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${isInvalid ? 'from-amber-600/40' : 'from-blood-900/40'} via-transparent to-transparent pointer-events-none`} />
        
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Fingerprint className={`w-5 h-5 ${isInvalid ? 'text-amber-500' : 'text-blood-500'}`} />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              UNIT PASSPORT
            </h3>
          </div>
          
          <div className="mb-8">
            <div className={`text-[10px] uppercase tracking-widest mb-1 ${isInvalid ? 'text-amber-200' : 'text-ink-400'}`}>UNIT ID</div>
            <div className="font-mono text-xl font-bold tracking-tight text-white">{unit.id}</div>
          </div>
          
          <div className="flex items-end gap-4 mb-4">
            <div>
              <div className={`text-[10px] uppercase tracking-widest mb-1 ${isInvalid ? 'text-amber-200' : 'text-ink-400'}`}>BLOOD GROUP</div>
              <div className={`text-4xl font-editorial font-bold ${isInvalid ? 'text-amber-400' : 'text-blood-400'}`}>{unit.bloodGroup}</div>
            </div>
            <div>
               <div className={`text-[10px] uppercase tracking-widest mb-1 ${isInvalid ? 'text-amber-200' : 'text-ink-400'}`}>COMPONENT</div>
               <div className={`text-xl font-bold text-ink-200 px-2 py-1 rounded ${isInvalid ? 'bg-amber-950' : 'bg-ink-800'}`}>{unit.component}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className={`text-[10px] uppercase tracking-widest ${isInvalid ? 'text-amber-200' : 'text-ink-400'}`}>TRACEABILITY</div>
          <div className={`text-xs font-bold uppercase tracking-widest ${isInvalid ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isInvalid ? 'COMPROMISED' : 'COMPLETE'}
          </div>
        </div>
      </div>
      
      {/* Logistics Details */}
      <div className="p-6 md:w-2/3 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
          <div>
            <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3" /> COLLECTION DATE
            </div>
            <div className="text-sm font-bold text-ink-900">{unit.collectionDate}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest flex items-center gap-1 mb-1">
              <AlertCircle className="w-3 h-3" /> EXPIRY DATE
            </div>
            <div className={`text-sm font-bold ${unit.currentState === 'EXPIRED' ? 'text-blood-600' : 'text-ink-900'}`}>
              {unit.expiryDate}
            </div>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3" /> SOURCE
            </div>
            <div className="text-sm font-bold text-ink-900">{unit.source}</div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3" /> DESTINATION
            </div>
            <div className="text-sm font-bold text-ink-900">{unit.destination}</div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-2">
            CURRENT OPERATIONAL STATE
          </div>
          <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl ${stateConfig.bg}`}>
            <StateIcon className="w-6 h-6" />
            <div>
              <div className="text-lg font-bold tracking-wider uppercase leading-none mb-1">
                {unit.currentState}
              </div>
              <div className="text-[10px] font-bold tracking-widest uppercase opacity-80 leading-none">
                LOC: {unit.currentLocation}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
