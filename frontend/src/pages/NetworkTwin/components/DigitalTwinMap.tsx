import React from 'react';
import type { Facility, TransportLink } from '../simulationData';

interface DigitalTwinMapProps {
  facilities: Facility[];
  links: TransportLink[];
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({ facilities, links }) => {
  // Helpers for node colors
  const getStatusColor = (status: Facility['status']) => {
    switch (status) {
      case 'normal': return '#1a1a1a'; // ink-900
      case 'watch': return '#f97316'; // orange-500
      case 'stressed': return '#ea580c'; // orange-600
      case 'critical': return '#b91c1c'; // blood-700
      case 'offline': return '#a3a3a3'; // ink-400
      default: return '#1a1a1a';
    }
  };

  const getLinkColor = (status: TransportLink['status']) => {
    switch (status) {
      case 'normal': return '#e5e5e5'; // ink-200
      case 'delayed': return '#f97316';
      case 'offline': return '#f5f5f5'; // ink-100 (almost invisible)
      default: return '#e5e5e5';
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-paper relative flex items-center justify-center p-8 border border-ink-200/40 rounded-lg shadow-sm">
      
      {/* Absolute badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-ink-900 text-white rounded-md text-[10px] font-bold tracking-widest uppercase">
        <div className="w-1.5 h-1.5 rounded-full bg-blood-500 animate-pulse" />
        Simulated Network Data
      </div>

      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full max-w-2xl max-h-2xl overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Render Links */}
        {links.map(link => {
          const source = facilities.find(f => f.id === link.sourceId);
          const target = facilities.find(f => f.id === link.targetId);
          if (!source || !target) return null;

          return (
            <g key={link.id}>
              <line 
                x1={source.location.x} 
                y1={source.location.y} 
                x2={target.location.x} 
                y2={target.location.y} 
                stroke={getLinkColor(link.status)}
                strokeWidth="0.5"
                strokeDasharray={link.status === 'delayed' ? "1 1" : "none"}
                className="transition-colors duration-500"
              />
              {/* Traffic particles if normal */}
              {link.status === 'normal' && (
                <circle r="0.8" fill="#a3a3a3">
                   <animateMotion 
                     dur={`${link.baseTravelTimeMin / 10}s`} 
                     repeatCount="indefinite"
                     path={`M ${source.location.x} ${source.location.y} L ${target.location.x} ${target.location.y}`}
                   />
                </circle>
              )}
            </g>
          );
        })}

        {/* Render Facilities */}
        {facilities.map(fac => {
          const color = getStatusColor(fac.status);
          const isCritical = fac.status === 'critical';
          const isOffline = fac.status === 'offline';

          return (
            <g key={fac.id} className="transition-all duration-500" transform={`translate(${fac.location.x}, ${fac.location.y})`}>
              
              {/* Pulse ring for critical/watch */}
              {(isCritical || fac.status === 'watch') && !isOffline && (
                <circle 
                  r="6" 
                  fill="none" 
                  stroke={color} 
                  strokeWidth="0.5"
                  className="animate-ping origin-center opacity-30" 
                />
              )}

              {/* Node body */}
              {fac.type === 'blood-bank' ? (
                <rect x="-3" y="-3" width="6" height="6" fill={isOffline ? 'none' : '#ffffff'} stroke={color} strokeWidth="1.5" rx="1" />
              ) : (
                <circle r="3" fill={isOffline ? 'none' : '#ffffff'} stroke={color} strokeWidth="1.5" />
              )}

              {/* Icon inside */}
              {fac.type === 'blood-bank' && !isOffline && (
                <text x="0" y="0.8" fontSize="2.5" fontWeight="bold" fill={color} textAnchor="middle" dominantBaseline="middle" className="font-editorial">B</text>
              )}
              {fac.type === 'hospital' && !isOffline && (
                <text x="0" y="1" fontSize="3" fontWeight="bold" fill={color} textAnchor="middle" dominantBaseline="middle">+</text>
              )}
              {isOffline && (
                <line x1="-2" y1="-2" x2="2" y2="2" stroke={color} strokeWidth="0.5" />
              )}

              {/* Labels */}
              <text x="0" y="6" fontSize="2.5" fontWeight="bold" fill="#1a1a1a" textAnchor="middle">{fac.name}</text>
              
              {/* Metrics */}
              {!isOffline ? (
                <>
                  <text x="0" y="9" fontSize="1.8" fill="#52525b" textAnchor="middle">
                    {fac.type === 'hospital' ? 'Reserves:' : 'Stock:'} {Object.values(fac.inventory).reduce((a,b)=>a+b, 0)}
                  </text>
                  <text x="0" y="11.5" fontSize="1.8" fill={color} textAnchor="middle" fontWeight="bold">
                    {fac.status.toUpperCase()}
                  </text>
                </>
              ) : (
                <text x="0" y="9" fontSize="1.8" fill={color} textAnchor="middle" fontWeight="bold">OFFLINE</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
