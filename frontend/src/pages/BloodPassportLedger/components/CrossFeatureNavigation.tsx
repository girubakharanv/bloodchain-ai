import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Navigation, ThermometerSnowflake, Activity, Network } from 'lucide-react';

interface CrossFeatureNavigationProps {
  unitId: string;
}

export const CrossFeatureNavigation: React.FC<CrossFeatureNavigationProps> = ({ unitId }) => {
  return (
    <div className="bg-white border border-ink-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Navigation className="w-4 h-4 text-ink-400" />
        <h3 className="text-xs font-bold text-ink-900 uppercase tracking-widest">
          FOLLOW UNIT
        </h3>
      </div>
      
      <p className="text-xs text-ink-500 mb-6 italic">
        Navigate to related modules while preserving this unit as the primary context.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Link 
          to={`/expiry-echo?unit=${unitId}`}
          className="flex flex-col items-center justify-center p-3 border border-ink-200 rounded-xl hover:border-blood-400 hover:bg-blood-50 transition-colors group"
        >
          <Clock className="w-5 h-5 text-ink-400 group-hover:text-blood-500 mb-2" />
          <span className="text-[9px] font-bold text-ink-600 group-hover:text-blood-700 uppercase tracking-widest text-center">
            View<br/>Expiry
          </span>
        </Link>
        
        <Link 
          to={`/bloodflow?unit=${unitId}`}
          className="flex flex-col items-center justify-center p-3 border border-ink-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-colors group"
        >
          <Network className="w-5 h-5 text-ink-400 group-hover:text-indigo-500 mb-2" />
          <span className="text-[9px] font-bold text-ink-600 group-hover:text-indigo-700 uppercase tracking-widest text-center">
            View<br/>Allocation
          </span>
        </Link>
        
        <Link 
          to={`/rescue-route?unit=${unitId}`}
          className="flex flex-col items-center justify-center p-3 border border-ink-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-colors group"
        >
          <Navigation className="w-5 h-5 text-ink-400 group-hover:text-emerald-500 mb-2" />
          <span className="text-[9px] font-bold text-ink-600 group-hover:text-emerald-700 uppercase tracking-widest text-center">
            View<br/>Route
          </span>
        </Link>
        
        <Link 
          to={`/cold-chain?unit=${unitId}`}
          className="flex flex-col items-center justify-center p-3 border border-ink-200 rounded-xl hover:border-sky-400 hover:bg-sky-50 transition-colors group"
        >
          <ThermometerSnowflake className="w-5 h-5 text-ink-400 group-hover:text-sky-500 mb-2" />
          <span className="text-[9px] font-bold text-ink-600 group-hover:text-sky-700 uppercase tracking-widest text-center">
            View<br/>Cold Chain
          </span>
        </Link>
        
        <Link 
          to={`/supply-stress?unit=${unitId}`}
          className="flex flex-col items-center justify-center p-3 border border-ink-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-colors group"
        >
          <Activity className="w-5 h-5 text-ink-400 group-hover:text-amber-500 mb-2" />
          <span className="text-[9px] font-bold text-ink-600 group-hover:text-amber-700 uppercase tracking-widest text-center">
            View<br/>Stress
          </span>
        </Link>
      </div>
    </div>
  );
};
