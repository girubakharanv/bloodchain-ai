import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { RouteScoreDetails, generateRouteReasons } from './routeEngine';

interface RouteExplanationProps {
  details: RouteScoreDetails | null;
  isComposed: boolean;
}

export const RouteExplanation: React.FC<RouteExplanationProps> = ({ details, isComposed }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Auto open when a new route is composed
  useEffect(() => {
    if (isComposed && details) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isComposed, details?.total]);

  const reasons = details && isComposed ? generateRouteReasons(details) : [];

  return (
    <div className="bg-white border border-ink-200/50 rounded-lg overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-ink-50/50 hover:bg-ink-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blood-600" />
          <span className="text-sm font-bold text-ink-900 uppercase tracking-wider">Why this route?</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-ink-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-ink-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-ink-200/50 bg-white">
          {!isComposed ? (
            <p className="text-sm text-ink-600 italic">
              "Route intelligence will explain the recommendation here after composing."
            </p>
          ) : reasons.length > 0 ? (
            <ul className="space-y-2">
              {reasons.map((reason, idx) => (
                <li key={idx} className={`text-sm flex items-start gap-2 ${
                  reason.startsWith('✓') ? 'text-emerald-700' :
                  reason.startsWith('⚠') ? 'text-amber-700' : 'text-blood-700'
                }`}>
                  <span className="font-bold flex-shrink-0">{reason.charAt(0)}</span>
                  <span>{reason.substring(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-600 italic">No specific intelligence insights available.</p>
          )}
        </div>
      )}
    </div>
  );
};
