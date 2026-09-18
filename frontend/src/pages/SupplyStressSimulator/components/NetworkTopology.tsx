import React from 'react';
import { FacilityStressResult } from '../utils/supplyStressEngine';
import { baseNetworkNodes, FacilityNode } from '../data/supplyStressData';
import { Network } from 'lucide-react';

interface NetworkTopologyProps {
  facilityStress: FacilityStressResult[];
  isStressed: boolean;
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({ facilityStress, isStressed }) => {

  const getStatusColor = (nodeId: string) => {
    const stress = facilityStress.find(f => f.nodeId === nodeId);
    if (!stress) return 'border-ink-200 bg-white text-ink-900';
    if (stress.isOffline) return 'border-ink-800 bg-ink-900 text-ink-500 opacity-50 border-dashed';
    
    if (stress.overallStress === 'CRITICAL') return 'border-blood-600 bg-blood-50 text-blood-900 shadow-[0_0_15px_rgba(220,38,38,0.3)]';
    if (stress.overallStress === 'HIGH') return 'border-amber-500 bg-amber-50 text-amber-900 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
    if (stress.overallStress === 'WATCH') return 'border-emerald-300 bg-emerald-50 text-emerald-900';
    return 'border-ink-200 bg-white text-ink-900';
  };

  const getEdgeColor = (fromId: string, toId: string) => {
    const fromStress = facilityStress.find(f => f.nodeId === fromId);
    const toStress = facilityStress.find(f => f.nodeId === toId);
    
    if (fromStress?.isOffline || toStress?.isOffline) return 'border-ink-200 border-dashed opacity-30';
    if (fromStress?.overallStress === 'CRITICAL' || toStress?.overallStress === 'CRITICAL') return 'border-blood-500 shadow-[0_0_5px_rgba(220,38,38,0.5)]';
    if (fromStress?.overallStress === 'HIGH' || toStress?.overallStress === 'HIGH') return 'border-amber-400';
    return 'border-ink-200';
  };

  // We will build a simple tree structure for visualization
  // Level 1: Blood Banks & Collection Centers
  // Level 2: Hospitals (connected to BBs)
  
  const level1 = baseNetworkNodes.filter(n => n.type === 'BLOOD_BANK' || n.type === 'COLLECTION_CENTER');
  
  return (
    <div className={`border ${isStressed ? 'border-amber-500/30 bg-ink-50' : 'border-ink-200 bg-white'} rounded-2xl shadow-sm overflow-hidden flex flex-col h-full transition-colors duration-500`}>
      <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-ink-500" />
          <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">
            Network Topology
          </h3>
        </div>
      </div>
      
      <div className="flex-grow p-6 relative overflow-hidden flex items-center justify-center">
        
        {/* Simple tree visualization layout */}
        <div className="flex w-full h-full max-w-2xl mx-auto items-stretch justify-between relative">
          
          {/* Level 1: Supply */}
          <div className="flex flex-col justify-around w-5/12 z-10 py-4 gap-4">
            {level1.map(node => (
              <div key={node.id} className="relative group">
                <div className={`p-3 border-2 rounded-lg text-xs font-bold transition-all duration-500 flex items-center justify-between ${getStatusColor(node.id)}`}>
                  <span>{node.name}</span>
                  <span className="text-[9px] uppercase tracking-widest opacity-60">
                    {node.type === 'BLOOD_BANK' ? 'BB' : 'CC'}
                  </span>
                </div>
                {/* Edges from this node to its connections */}
                {node.connections.map(connId => {
                  // Find the target node in level 2 (which we will render on the right)
                  // For a real generic tree we'd need complex SVG, but for our simple deterministic data, CSS is fine.
                  // We'll just draw horizontal/diagonal lines conceptually using SVGs overlaid
                  return null; 
                })}
              </div>
            ))}
          </div>

          {/* Edges (SVG overlay) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
             {level1.map((node, i) => {
                return node.connections.map(connId => {
                  const targetIndex = baseNetworkNodes.filter(n => n.type === 'HOSPITAL').findIndex(n => n.id === connId);
                  if (targetIndex === -1) return null;
                  
                  const numSources = level1.length;
                  const numTargets = baseNetworkNodes.filter(n => n.type === 'HOSPITAL').length;
                  
                  // Approximate y positions based on flex-col justify-around
                  const y1 = ((i + 1) / (numSources + 1)) * 100;
                  const y2 = ((targetIndex + 1) / (numTargets + 1)) * 100;
                  
                  const strokeColor = getEdgeColor(node.id, connId).includes('blood') ? '#ef4444' : 
                                      getEdgeColor(node.id, connId).includes('amber') ? '#f59e0b' : 
                                      getEdgeColor(node.id, connId).includes('dashed') ? '#e5e7eb' : '#e5e7eb';
                  const strokeDash = getEdgeColor(node.id, connId).includes('dashed') ? '4' : '0';
                  const opacity = getEdgeColor(node.id, connId).includes('dashed') ? 0.3 : 1;

                  return (
                    <path 
                      key={`${node.id}-${connId}`}
                      d={`M 41.66% ${y1}% C 55% ${y1}%, 65% ${y2}%, 75% ${y2}%`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2"
                      strokeDasharray={strokeDash}
                      opacity={opacity}
                      className="transition-all duration-700"
                    />
                  );
                });
             })}
          </svg>

          {/* Level 2: Demand */}
          <div className="flex flex-col justify-around w-4/12 z-10 py-4 gap-2">
            {baseNetworkNodes.filter(n => n.type === 'HOSPITAL').map(node => (
              <div key={node.id} className={`p-2 border-2 rounded-lg text-[10px] font-bold transition-all duration-500 ${getStatusColor(node.id)}`}>
                {node.name}
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
