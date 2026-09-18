import React from 'react';
import { RouteRequest, RouteOption } from '../../data/routeData';
import { FacilityMarker } from './FacilityMarker';

interface RouteMapProps {
  request: RouteRequest;
  selectedRouteId: string | null;
  isComposed?: boolean;
  selectedRouteObj?: RouteOption | null;
}

export const RouteMap: React.FC<RouteMapProps> = ({ request, selectedRouteId, isComposed, selectedRouteObj }) => {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-ink-900 rounded-2xl overflow-hidden shadow-inner border border-ink-800">
      {/* Background map texture/grid placeholder */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Simulated Roads/Paths - Just visual placeholders */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        {/* Subtle grid lines */}
        <line x1="20%" y1="0" x2="20%" y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="80%" y1="0" x2="80%" y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        
        {/* Route A - Shortest */}
        <path 
          d="M 200,150 Q 300,100 450,250" 
          fill="none" 
          stroke={selectedRouteId === 'route-a' ? '#E11D48' : 'rgba(255,255,255,0.1)'} 
          strokeWidth={selectedRouteId === 'route-a' ? '3' : '2'}
          strokeDasharray={selectedRouteId === 'route-a' && isComposed ? 'none' : '5,5'}
          className={selectedRouteId === 'route-a' && isComposed ? 'animate-pulse' : ''}
        />
        
        {/* Route B - Fastest */}
        <path 
          d="M 200,150 Q 250,300 450,250" 
          fill="none" 
          stroke={selectedRouteId === 'route-b' ? '#E11D48' : 'rgba(255,255,255,0.1)'} 
          strokeWidth={selectedRouteId === 'route-b' ? '3' : '2'}
          strokeDasharray={selectedRouteId === 'route-b' && isComposed ? 'none' : '5,5'}
          className={selectedRouteId === 'route-b' && isComposed ? 'animate-pulse' : ''}
        />

        {/* Route C - Recommended */}
        <path 
          d="M 200,150 C 300,200 400,150 450,250" 
          fill="none" 
          stroke={selectedRouteId === 'route-c' ? '#E11D48' : 'rgba(255,255,255,0.1)'} 
          strokeWidth={selectedRouteId === 'route-c' ? '4' : '2'}
          strokeDasharray={selectedRouteId === 'route-c' && isComposed ? 'none' : '5,5'}
        />
        
        {/* Selected Route Animation (Pulse moving along path) */}
        {selectedRouteId === 'route-c' && isComposed && (
          <circle r="4" fill="#E11D48" className="animate-ping">
            <animateMotion 
              dur="3s" 
              repeatCount="indefinite" 
              path="M 200,150 C 300,200 400,150 450,250"
            />
          </circle>
        )}
        {selectedRouteId === 'route-a' && isComposed && (
          <circle r="4" fill="#E11D48" className="animate-ping">
            <animateMotion 
              dur="3s" 
              repeatCount="indefinite" 
              path="M 200,150 Q 300,100 450,250"
            />
          </circle>
        )}
        {selectedRouteId === 'route-b' && isComposed && (
          <circle r="4" fill="#E11D48" className="animate-ping">
            <animateMotion 
              dur="3s" 
              repeatCount="indefinite" 
              path="M 200,150 Q 250,300 450,250"
            />
          </circle>
        )}
      </svg>

      {/* Markers */}
      <FacilityMarker 
        facility={
          isComposed && selectedRouteObj 
            ? { ...request.source!, name: selectedRouteObj.sourceName, localStock: selectedRouteObj.availableUnits }
            : request.source!
        } 
        type="source" 
        style={{ left: '200px', top: '150px' }} 
      />
      
      <FacilityMarker 
        facility={request.destination} 
        type="destination" 
        style={{ left: '450px', top: '250px' }} 
      />
      
      {/* Small UI Overlay for map context */}
      <div className="absolute bottom-4 left-4 bg-ink-900/80 backdrop-blur border border-ink-800 rounded px-3 py-2">
        <span className="text-[10px] font-bold text-ink-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blood-600 animate-pulse"></span>
          Live Logistics Map
        </span>
      </div>
    </div>
  );
};
