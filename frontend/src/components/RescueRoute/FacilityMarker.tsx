import React, { useState } from 'react';
import { RouteFacility } from '../../data/routeData';
import { Building2, Plus, AlertCircle, Droplets } from 'lucide-react';

interface FacilityMarkerProps {
  facility: RouteFacility;
  type: 'source' | 'destination';
  style?: React.CSSProperties;
}

export const FacilityMarker: React.FC<FacilityMarkerProps> = ({ facility, type, style }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="absolute" style={style}>
      {/* Marker dot */}
      <div 
        className="relative group cursor-pointer"
        onClick={() => setShowPopup(!showPopup)}
      >
        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md z-10 relative ${
          type === 'source' ? 'bg-blood-500' : 'bg-ink-800'
        }`}>
          <div className={`absolute inset-0 rounded-full animate-ping opacity-50 ${
            type === 'source' ? 'bg-blood-400' : 'bg-ink-400'
          }`} />
        </div>
        
        {/* Hover label */}
        {!showPopup && (
          <div className="absolute top-1/2 left-6 -translate-y-1/2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm text-xs font-bold text-ink-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {facility.name}
          </div>
        )}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 bg-white rounded-lg shadow-xl border border-ink-200/50 p-3 z-20 overflow-hidden">
          {/* Top accent line */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${
            type === 'source' ? 'bg-blood-500' : 'bg-ink-800'
          }`} />
          
          <div className="flex items-start gap-2 mb-2 pt-1">
            {type === 'source' ? (
              <Building2 className="w-4 h-4 text-blood-600 mt-0.5" />
            ) : (
              <Plus className="w-4 h-4 text-ink-600 mt-0.5" />
            )}
            <div>
              <h4 className="text-xs font-bold text-ink-900 leading-tight">{facility.name}</h4>
              <span className="text-[10px] text-ink-500 font-medium">
                {type === 'source' ? 'BLOOD BANK' : 'HOSPITAL'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 mt-3">
            {facility.bloodType && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-500 font-medium">Blood/Product</span>
                <div className="flex items-center gap-1 font-bold text-blood-700">
                  <Droplets className="w-3 h-3" />
                  {facility.bloodType} / {facility.productType}
                </div>
              </div>
            )}
            
            {type === 'source' && facility.localStock !== undefined && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-500 font-medium">Available</span>
                <span className="font-bold text-ink-900">{facility.localStock} UNITS</span>
              </div>
            )}

            {type === 'destination' && facility.requestedUnits !== undefined && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-500 font-medium">Request</span>
                <span className="font-bold text-ink-900">{facility.requestedUnits} {facility.bloodType}</span>
              </div>
            )}

            {facility.timeConstraintText && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-500 font-medium">Required</span>
                <span className="font-bold text-blood-600">{facility.timeConstraintText}</span>
              </div>
            )}

            {facility.localStock !== undefined && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-500 font-medium">Local Stock</span>
                <span className="font-bold text-ink-900">{facility.localStock} UNITS</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-1 mt-1 border-t border-ink-100">
              <span className="text-ink-500 font-medium">Status</span>
              <span className={`font-bold text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                facility.status === 'READY' 
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blood-100 text-blood-800 flex items-center gap-1'
              }`}>
                {facility.status === 'URGENT' && <AlertCircle className="w-3 h-3" />}
                {facility.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
