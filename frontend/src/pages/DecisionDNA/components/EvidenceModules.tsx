import React from 'react';
import { Database, Network, Clock, LocateFixed, Thermometer, Compass, AlertTriangle, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { DecisionEvidence } from '../types/decisionDna';
import { useNavigate } from 'react-router-dom';

interface EvidenceModulesProps {
  evidence: DecisionEvidence[];
  currentStage: number;
  selectedEvidence: string | null;
  onEvidenceClick: (moduleId: string | null) => void;
}

const getModuleIcon = (name: string) => {
  if (name.includes('Time Machine')) return <Clock className="w-5 h-5" />;
  if (name.includes('BloodFlow')) return <Network className="w-5 h-5" />;
  if (name.includes('Route')) return <LocateFixed className="w-5 h-5" />;
  if (name.includes('Cold Chain')) return <Thermometer className="w-5 h-5" />;
  if (name.includes('Compass')) return <Compass className="w-5 h-5" />;
  if (name.includes('Stress')) return <AlertTriangle className="w-5 h-5" />;
  if (name.includes('Passport')) return <Database className="w-5 h-5" />;
  return <Database className="w-5 h-5" />;
};

const getModuleRoute = (name: string) => {
  if (name.includes('Time Machine')) return '/network-twin';
  if (name.includes('BloodFlow')) return '/bloodflow-negotiator';
  if (name.includes('Route')) return '/rescue-route';
  if (name.includes('Cold Chain')) return '/cold-chain';
  if (name.includes('Compass')) return '/collection-compass';
  if (name.includes('Stress')) return '/supply-stress';
  if (name.includes('Passport')) return '/blood-passport';
  if (name.includes('Expiry')) return '/expiry-intelligence';
  return '/';
};

export const EvidenceModules: React.FC<EvidenceModulesProps> = ({ 
  evidence, 
  currentStage,
  selectedEvidence,
  onEvidenceClick
}) => {
  const isVisible = currentStage >= 1;
  const navigate = useNavigate();

  const handleNavigate = (e: React.MouseEvent, route: string) => {
    e.stopPropagation();
    navigate(route);
  };

  return (
    <div className={`transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4 pointer-events-none'
    }`}>
      <div className="flex items-center gap-2 mb-6">
        <LinkIcon className="w-4 h-4 text-ink-400" />
        <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest">
          CROSS-NETWORK EVIDENCE
        </h3>
        <div className="ml-2 px-2 py-0.5 bg-ink-100 text-ink-500 rounded text-[9px] font-bold uppercase tracking-widest">
          {evidence.filter(e => e.status === 'ACTIVE').length} Active Modules
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {evidence.map(module => {
          const isSelected = selectedEvidence === module.moduleId;
          const isDimmed = selectedEvidence && !isSelected;

          return (
            <div 
              key={module.moduleId}
              onClick={() => onEvidenceClick(isSelected ? null : module.moduleId)}
              className={`bg-white border rounded-xl p-4 flex flex-col justify-between h-32 relative overflow-hidden transition-all duration-300 cursor-pointer ${
                isSelected 
                  ? 'border-blood-500 ring-1 ring-blood-500 shadow-md' 
                  : isDimmed
                    ? 'border-ink-100 opacity-40'
                    : 'border-ink-200 hover:border-ink-300 hover:shadow-sm'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blood-500/10 via-transparent to-transparent pointer-events-none" />
              )}
              
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg ${
                  module.status === 'UNAVAILABLE' ? 'bg-ink-50 text-ink-300' :
                  isSelected ? 'bg-blood-50 text-blood-600' : 'bg-ink-50 text-ink-600'
                }`}>
                  {getModuleIcon(module.moduleName)}
                </div>
                
                <div className="flex gap-1">
                  {isSelected && (
                    <button 
                      onClick={(e) => handleNavigate(e, getModuleRoute(module.moduleName))}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-ink-100 text-ink-400 hover:text-ink-600 transition-colors"
                      title="Open Module"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                  <div className={`w-2 h-2 rounded-full mt-2 mr-1 ${
                    module.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' :
                    module.status === 'AVAILABLE' ? 'bg-blue-500' : 'bg-ink-300'
                  }`} />
                </div>
              </div>
              
              <div>
                <div className={`text-xs font-bold mb-1 truncate ${
                  module.status === 'UNAVAILABLE' ? 'text-ink-400' : 'text-ink-900'
                }`} title={module.moduleName}>
                  {module.moduleName}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`text-[9px] font-bold uppercase tracking-widest ${
                    module.status === 'UNAVAILABLE' ? 'text-ink-300' :
                    module.contribution === 'PRIMARY' ? 'text-blood-600' :
                    module.contribution === 'HIGH' ? 'text-ink-600' :
                    module.contribution === 'MEDIUM' ? 'text-ink-500' :
                    'text-ink-400'
                  }`}>
                    {module.status === 'UNAVAILABLE' ? 'DATA UNAVAILABLE' : `${module.contribution} SIGNAL`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
