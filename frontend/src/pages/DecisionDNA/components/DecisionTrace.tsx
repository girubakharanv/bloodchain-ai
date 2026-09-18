import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { CausalNode } from '../types/decisionDna';

interface DecisionTraceProps {
  nodes: CausalNode[];
  currentStage: number;
  selectedEvidence: string | null;
}

export const DecisionTrace: React.FC<DecisionTraceProps> = ({ nodes, currentStage, selectedEvidence }) => {
  // Map trace stages to nodes:
  // stage 0 = network state (node 0)
  // stage 1 = evidence (node 0)
  // stage 2 = drivers (node 1)
  // stage 3 = constraints (node 2 if exists)
  // stage 4 = alternatives (node 2)
  // stage 5 = decision (last node)
  
  const isNodeActive = (index: number, node: CausalNode) => {
    if (node.type === 'INPUTS') return currentStage >= 0;
    if (node.type === 'FACTORS') return currentStage >= 2;
    if (node.type === 'CONSTRAINTS') return currentStage >= 3;
    if (node.type === 'DECISION') return currentStage >= 5;
    return false;
  };

  const isNodeFocused = (index: number, node: CausalNode) => {
    // If we have selected evidence, everything dims a bit unless it's related
    // (For this prototype, we just dim everything slightly if evidence is selected)
    if (selectedEvidence) return false;
    
    // During playback, highlight the most recently activated node
    if (currentStage >= 6) return false; // finished
    
    if (node.type === 'INPUTS' && currentStage === 0) return true;
    if (node.type === 'FACTORS' && currentStage === 2) return true;
    if (node.type === 'CONSTRAINTS' && currentStage === 3) return true;
    if (node.type === 'DECISION' && currentStage === 5) return true;
    return false;
  };

  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-8 shadow-sm overflow-hidden animate-fade-in transition-all relative">
      {selectedEvidence && (
        <div className="absolute inset-0 bg-white/40 z-20 pointer-events-none transition-opacity duration-500" />
      )}
      
      <div className="mb-12 relative z-30">
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-widest mb-1">
          DECISION DNA TRACE
        </h3>
        <div className="text-sm text-ink-500 italic">
          The operational factors and constraints leading to this recommendation.
        </div>
      </div>
      
      {/* Desktop Horizontal View */}
      <div className="hidden lg:flex items-center justify-between relative px-4 py-8 z-30">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-ink-100 -translate-y-1/2 z-0" />
        
        {nodes.map((node, idx) => {
          const active = isNodeActive(idx, node);
          const focused = isNodeFocused(idx, node);
          
          return (
            <React.Fragment key={node.id}>
              <div className={`relative z-10 flex flex-col items-center group w-48 transition-all duration-700 ${
                active ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4'
              } ${focused ? 'scale-110' : 'scale-100'}`}>
                
                <div className={`text-[10px] font-bold uppercase tracking-widest mb-4 h-4 text-center transition-colors duration-500 ${
                  active ? 'text-ink-400' : 'text-ink-200'
                }`}>
                  {node.type}
                </div>
                
                <div className={`w-full p-4 rounded-xl border transition-all duration-500 text-center ${
                  node.type === 'DECISION' 
                    ? (active ? 'bg-ink-900 border-ink-900 shadow-lg' : 'bg-ink-800 border-ink-700')
                    : (active ? 'bg-white border-ink-300 shadow-sm' : 'bg-ink-50 border-ink-100')
                } ${focused && node.type !== 'DECISION' ? 'ring-2 ring-blood-500 border-transparent shadow-[0_0_15px_rgba(220,38,38,0.2)]' : ''}`}>
                  <div className={`text-[9px] font-bold uppercase tracking-widest mb-2 truncate transition-colors duration-500 ${
                    node.type === 'DECISION' ? 'text-ink-400' : (active ? 'text-ink-500' : 'text-ink-300')
                  }`} title={node.title}>
                    {node.title}
                  </div>
                  <div className={`text-sm font-bold line-clamp-2 leading-tight h-10 flex items-center justify-center transition-colors duration-500 ${
                    node.type === 'DECISION' ? (active ? 'text-white' : 'text-ink-500') : (active ? 'text-ink-900' : 'text-ink-400')
                  }`} title={node.value}>
                    {node.value}
                  </div>
                </div>
                
                <div className={`mt-4 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded transition-all duration-500 ${
                  !active ? 'bg-ink-50 text-ink-300 border border-transparent' :
                  node.impact === 'CRITICAL' ? 'bg-blood-50 text-blood-700 border border-blood-100' :
                  node.impact === 'HIGH' ? 'bg-ink-100 text-ink-900 border border-ink-200' :
                  node.impact === 'FINAL' ? 'bg-ink-800 text-ink-200 border border-transparent' :
                  'bg-white border border-ink-200 text-ink-500'
                }`}>
                  {node.impact !== 'FINAL' ? `${node.impact} IMPACT` : 'OUTPUT'}
                </div>
              </div>
              
              {idx < nodes.length - 1 && (
                <div className="relative z-10 text-ink-300 overflow-hidden w-full h-5 flex justify-center">
                  <ArrowRight className={`w-5 h-5 transition-transform duration-1000 ${
                    isNodeActive(idx + 1, nodes[idx + 1]) ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                  }`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Mobile/Tablet Vertical View */}
      <div className="flex lg:hidden flex-col items-center relative py-4 z-30">
        {/* Connecting Line */}
        <div className="absolute top-8 bottom-8 left-1/2 w-0.5 bg-ink-100 -translate-x-1/2 z-0" />
        
        {nodes.map((node, idx) => {
          const active = isNodeActive(idx, node);
          
          return (
            <React.Fragment key={node.id}>
              <div className={`relative z-10 flex flex-col items-center group w-64 my-2 transition-all duration-700 ${
                active ? 'opacity-100' : 'opacity-20'
              }`}>
                <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-2 text-center">
                  {node.type}
                </div>
                
                <div className={`w-full p-4 rounded-xl border text-center ${
                  node.type === 'DECISION' 
                    ? (active ? 'bg-ink-900 border-ink-900 shadow-lg' : 'bg-ink-800 border-ink-700')
                    : (active ? 'bg-white border-ink-300 shadow-sm' : 'bg-ink-50 border-ink-100')
                }`}>
                  <div className={`text-[9px] font-bold uppercase tracking-widest mb-1 truncate ${
                    node.type === 'DECISION' ? 'text-ink-400' : (active ? 'text-ink-500' : 'text-ink-300')
                  }`}>
                    {node.title}
                  </div>
                  <div className={`text-sm font-bold ${
                    node.type === 'DECISION' ? (active ? 'text-white' : 'text-ink-500') : (active ? 'text-ink-900' : 'text-ink-400')
                  }`}>
                    {node.value}
                  </div>
                </div>
              </div>
              
              {idx < nodes.length - 1 && (
                <div className={`relative z-10 text-ink-300 my-2 bg-white rounded-full p-1 transition-all duration-1000 ${
                  isNodeActive(idx + 1, nodes[idx + 1]) ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}>
                  <ArrowDown className="w-5 h-5" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
    </div>
  );
};
