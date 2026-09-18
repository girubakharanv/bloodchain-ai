import React from 'react';
import type { SimulationResult } from '../simulationEngine';
import { defaultScenario, baselineFacilities } from '../simulationData';
import { Activity, ArrowRight, ShieldAlert } from 'lucide-react';

interface ImpactComparisonProps {
  currentResult: SimulationResult; // Simulation at NOW with defaultScenario
  simulatedResult: SimulationResult; // Simulation at timeOffset with active scenario
}

export const ImpactComparison: React.FC<ImpactComparisonProps> = ({ currentResult, simulatedResult }) => {
  
  return (
    <div className="bg-white border border-ink-200/40 rounded shadow-sm p-6">
      <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest mb-6">Network Impact Analysis</h3>

      {/* TODAY VS FUTURE */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-8">
        <div className="bg-paper p-4 rounded border border-ink-200">
          <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-4">Baseline (Now)</div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-ink-600">Network Stress</span>
            <span className="font-bold text-ink-900">{Math.round(currentResult.networkStress)}%</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-ink-600">Affected Facilities</span>
            <span className="font-bold text-ink-900">{currentResult.affectedHospitals}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-ink-600">Reserve Depletions</span>
            <span className="font-bold text-ink-900">{currentResult.reserveDepletionCount}</span>
          </div>
        </div>

        <div className="flex items-center justify-center text-ink-300">
          <ArrowRight size={24} />
        </div>

        <div className={`p-4 rounded border ${simulatedResult.networkStress > 70 ? 'bg-blood-50 border-blood-200' : 'bg-orange-50 border-orange-200'}`}>
          <div className="text-[10px] font-bold text-ink-600 uppercase tracking-widest mb-4">Simulated Future</div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-ink-600">Network Stress</span>
            <span className={`font-bold ${simulatedResult.networkStress > 70 ? 'text-blood-700' : 'text-orange-700'}`}>{Math.round(simulatedResult.networkStress)}%</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-ink-600">Affected Facilities</span>
            <span className="font-bold text-ink-900">{simulatedResult.affectedHospitals}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-ink-600">Reserve Depletions</span>
            <span className={`font-bold ${simulatedResult.reserveDepletionCount > 0 ? 'text-blood-700' : 'text-ink-900'}`}>{simulatedResult.reserveDepletionCount}</span>
          </div>
        </div>
      </div>

      <hr className="border-ink-100 mb-6" />

      {/* Inventory Trajectory Chart (Mock SVG) */}
      <div>
         <div className="flex justify-between items-end mb-4">
           <h4 className="text-xs font-bold text-ink-900 uppercase tracking-widest">Inventory Trajectory</h4>
           <div className="flex gap-4 text-[10px] font-bold uppercase">
             <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-blood-600" /> Projected</div>
             <div className="flex items-center gap-1"><div className="w-2 h-0.5 bg-ink-400 border-t border-dashed" /> Safety Reserve</div>
           </div>
         </div>

         <div className="h-40 bg-ink-50 border border-ink-200 rounded relative overflow-hidden flex items-end">
           {/* Chart Background Grid */}
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           
           {/* Mock Data based on stress */}
           {simulatedResult.networkStress > 60 ? (
             <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
               {/* Safety Reserve Line */}
               <line x1="0" y1="70" x2="100" y2="70" stroke="#a3a3a3" strokeWidth="1" strokeDasharray="2 2" />
               <text x="5" y="65" fontSize="4" fill="#a3a3a3" className="font-bold">RESERVE THRESHOLD</text>
               
               {/* Trajectory Line */}
               <polyline points="0,20 20,25 40,40 60,75 80,90 100,95" fill="none" stroke="#dc2626" strokeWidth="2" />
               <path d="M0,100 L0,20 L20,25 L40,40 L60,75 L80,90 L100,95 L100,100 Z" fill="rgba(220, 38, 38, 0.1)" />

               {/* Breach Point */}
               <circle cx="56" cy="70" r="2" fill="#dc2626" className="animate-ping" />
               <circle cx="56" cy="70" r="1.5" fill="#991b1b" />
               
               <g transform="translate(60, 60)">
                 <rect x="0" y="0" width="30" height="8" fill="#fef2f2" stroke="#f87171" strokeWidth="0.5" rx="1" />
                 <text x="15" y="5.5" fontSize="3" fill="#b91c1c" textAnchor="middle" fontWeight="bold">RESERVE BREACH</text>
               </g>
             </svg>
           ) : (
             <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
               {/* Safety Reserve Line */}
               <line x1="0" y1="70" x2="100" y2="70" stroke="#a3a3a3" strokeWidth="1" strokeDasharray="2 2" />
               <text x="5" y="65" fontSize="4" fill="#a3a3a3" className="font-bold">RESERVE THRESHOLD</text>
               
               {/* Trajectory Line */}
               <polyline points="0,20 20,22 40,28 60,35 80,45 100,50" fill="none" stroke="#2563eb" strokeWidth="2" />
               <path d="M0,100 L0,20 L20,22 L40,28 L60,35 L80,45 L100,50 L100,100 Z" fill="rgba(37, 99, 235, 0.1)" />
             </svg>
           )}
         </div>
      </div>
    </div>
  );
};
