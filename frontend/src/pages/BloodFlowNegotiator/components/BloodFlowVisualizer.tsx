import React from 'react';
import type { BloodRequest, NetworkSupply, AllocationPlan } from '../negotiatorData';

interface BloodFlowVisualizerProps {
  mode: 'conflict' | 'negotiating' | 'allocated';
  supply: NetworkSupply;
  requests: BloodRequest[];
  allocation: AllocationPlan | null;
}

export const BloodFlowVisualizer: React.FC<BloodFlowVisualizerProps> = ({ mode, supply, requests, allocation }) => {
  const bbX = 50, bbY = 20;
  
  const getHospitalPos = (index: number) => {
    const spacing = 30;
    const offset = (requests.length - 1) * spacing / 2;
    return { x: 50 - offset + (index * spacing), y: 80 };
  };

  return (
    <div className="w-full h-full bg-paper rounded-lg border border-ink-200/40 relative overflow-hidden flex items-center justify-center min-h-[400px]">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <svg viewBox="0 0 100 100" className="w-full h-full max-w-2xl max-h-2xl overflow-visible" preserveAspectRatio="xMidYMid meet">
        
        {/* Draw Links */}
        {requests.map((req, idx) => {
          const { x, y } = getHospitalPos(idx);
          const allocatedUnits = allocation?.allocations.find(a => a.requestId === req.id)?.allocatedUnits || 0;
          
          return (
            <g key={`link-${req.id}`}>
              {/* Base Link */}
              <line 
                x1={bbX} y1={bbY} x2={x} y2={y} 
                stroke={mode === 'conflict' ? '#dc2626' : '#e5e5e5'} 
                strokeWidth={mode === 'conflict' ? '0.5' : '1'}
                strokeDasharray={mode === 'conflict' ? '1 2' : 'none'}
                className="transition-all duration-1000"
              />
              
              {/* Conflict Mode - Requests Pulling */}
              {mode === 'conflict' && (
                <circle r="1" fill="#dc2626" className="opacity-50">
                  <animateMotion 
                    dur={`${1 + idx * 0.2}s`} 
                    repeatCount="indefinite"
                    path={`M ${x} ${y} L ${bbX} ${bbY}`}
                  />
                </circle>
              )}

              {/* Negotiating Mode - Particles flowing out */}
              {mode === 'negotiating' && (
                <circle r="1" fill="#dc2626">
                  <animateMotion 
                    dur="0.8s" 
                    repeatCount="indefinite"
                    path={`M ${bbX} ${bbY} L ${x} ${y}`}
                  />
                </circle>
              )}

              {/* Allocated Mode - Thicker line based on allocation */}
              {mode === 'allocated' && allocatedUnits > 0 && (
                <line 
                  x1={bbX} y1={bbY} x2={x} y2={y} 
                  stroke="#dc2626" 
                  strokeWidth={allocatedUnits / 10}
                  className="animate-fade-in opacity-80 transition-all duration-1000"
                />
              )}
              {mode === 'allocated' && allocatedUnits > 0 && (
                 <circle r={allocatedUnits / 5} fill="#dc2626" className="opacity-20 animate-pulse">
                   <animateMotion dur="2s" repeatCount="indefinite" path={`M ${bbX} ${bbY} L ${x} ${y}`} />
                 </circle>
              )}
            </g>
          );
        })}

        {/* Central Blood Bank */}
        <g transform={`translate(${bbX}, ${bbY})`} className="transition-all duration-500">
          {mode === 'conflict' && (
             <circle r="12" fill="none" stroke="#dc2626" strokeWidth="0.5" className="animate-ping opacity-30 origin-center" />
          )}
          <circle r="8" fill="#ffffff" stroke="#1a1a1a" strokeWidth="1.5" />
          <text x="0" y="1" fontSize="4" fontWeight="bold" fill="#1a1a1a" textAnchor="middle" dominantBaseline="middle" className="font-editorial">B</text>
          
          <text x="0" y="-12" fontSize="3" fontWeight="bold" fill="#1a1a1a" textAnchor="middle">BLOOD BANK A</text>
          
          {/* Supply Text */}
          <rect x="-10" y="10" width="20" height="6" fill="#1a1a1a" rx="1" />
          {mode === 'allocated' && allocation ? (
            <text x="0" y="14" fontSize="2.5" fontWeight="bold" fill="#ffffff" textAnchor="middle">
              {supply.totalAvailable - allocation.totalAllocated} REMAINING
            </text>
          ) : (
            <text x="0" y="14" fontSize="2.5" fontWeight="bold" fill="#ffffff" textAnchor="middle">
              {supply.totalAvailable} O+ AVAILABLE
            </text>
          )}
        </g>

        {/* Hospitals */}
        {requests.map((req, idx) => {
          const { x, y } = getHospitalPos(idx);
          const allocated = allocation?.allocations.find(a => a.requestId === req.id)?.allocatedUnits;

          return (
            <g key={`hosp-${req.id}`} transform={`translate(${x}, ${y})`}>
              <circle r="6" fill="#ffffff" stroke={mode === 'conflict' ? '#dc2626' : '#1a1a1a'} strokeWidth="1.5" />
              <text x="0" y="1.5" fontSize="4" fontWeight="bold" fill={mode === 'conflict' ? '#dc2626' : '#1a1a1a'} textAnchor="middle" dominantBaseline="middle">+</text>
              
              <text x="0" y="9" fontSize="2.5" fontWeight="bold" fill="#1a1a1a" textAnchor="middle">{req.facilityName}</text>
              
              {/* Status Pill */}
              <rect x="-8" y="12" width="16" height="5" fill={mode === 'allocated' ? '#fef2f2' : '#fff7ed'} stroke={mode === 'allocated' ? '#fecaca' : '#ffedd5'} rx="1" />
              {mode === 'allocated' && allocated !== undefined ? (
                <text x="0" y="15.5" fontSize="2.5" fontWeight="bold" fill="#b91c1c" textAnchor="middle">
                  {allocated} ALLOCATED
                </text>
              ) : (
                <text x="0" y="15.5" fontSize="2.5" fontWeight="bold" fill="#c2410c" textAnchor="middle">
                  {req.requestedUnits} REQUESTED
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Lower Status Bar */}
      {mode === 'allocated' && allocation && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center animate-fade-in">
           <div className="flex items-center gap-4 bg-white/90 backdrop-blur border border-ink-200 px-4 py-2 rounded-full shadow-sm text-xs font-bold uppercase tracking-widest text-ink-900">
             <div><span className="text-blood-700">{allocation.totalAllocated}</span> UNITS ALLOCATED</div>
             <div className="w-1 h-1 rounded-full bg-ink-300" />
             <div><span className="text-ink-500">{supply.totalAvailable - allocation.totalAllocated}</span> UNITS RESERVED</div>
           </div>
        </div>
      )}

    </div>
  );
};
