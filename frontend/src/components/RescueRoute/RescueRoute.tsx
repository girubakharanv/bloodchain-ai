import React, { useState, useEffect } from 'react';
import { RouteMap } from './RouteMap';
import { RouteIntelligence } from './RouteIntelligence';
import { RouteOption } from './RouteOption';
import { RouteConstraints } from './RouteConstraints';
import { RouteScore } from './RouteScore';
import { RouteExplanation } from './RouteExplanation';
import { mockRouteRequest, mockRouteConstraints } from '../../data/routeData';
import { recommendBestRoute, WhatIfModifiers, RouteScoreDetails } from './routeEngine';

export const RescueRoute: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [isComposed, setIsComposed] = useState(false);
  const [whatIfModifiers, setWhatIfModifiers] = useState<WhatIfModifiers>({
    transportAddedMin: 0,
    stockReducedUnits: 0,
    expiryReducedHours: 0
  });

  const [rankedRoutes, setRankedRoutes] = useState<any[]>([]);
  const [bestRoute, setBestRoute] = useState<any>(null);
  const [networkConstraint, setNetworkConstraint] = useState(false);

  // Calculate whenever state changes after composing
  useEffect(() => {
    if (isComposed) {
      const result = recommendBestRoute(mockRouteRequest.options, mockRouteRequest, whatIfModifiers);
      setRankedRoutes(result.rankedRoutes);
      setBestRoute(result.bestRoute);
      setNetworkConstraint(result.networkConstraint);

      // Only auto-select the best if we haven't selected one, or if we want to force it
      // Let's force it to select best route if recalculating from WhatIf makes current route unfeasible
      if (result.bestRoute) {
        const currentStillFeasible = result.rankedRoutes.find(r => r.route.id === selectedRouteId)?.details.isFeasible;
        if (!currentStillFeasible) {
          setSelectedRouteId(result.bestRoute.id);
        } else if (!selectedRouteId) {
          setSelectedRouteId(result.bestRoute.id);
        }
      }
    }
  }, [isComposed, whatIfModifiers]);

  const handleCompose = () => {
    setIsComposed(true);
    const result = recommendBestRoute(mockRouteRequest.options, mockRouteRequest, whatIfModifiers);
    if (result.bestRoute) {
      setSelectedRouteId(result.bestRoute.id);
    }
  };

  const handleReset = () => {
    setIsComposed(false);
    setSelectedRouteId(null);
    setWhatIfModifiers({ transportAddedMin: 0, stockReducedUnits: 0, expiryReducedHours: 0 });
    setRankedRoutes([]);
    setBestRoute(null);
    setNetworkConstraint(false);
  };

  const getRouteDetails = (routeId: string | null): RouteScoreDetails | null => {
    if (!routeId) return null;
    const found = rankedRoutes.find(r => r.route.id === routeId);
    return found ? found.details : null;
  };

  const selectedDetails = getRouteDetails(selectedRouteId);
  const selectedRouteObj = mockRouteRequest.options.find(r => r.id === selectedRouteId) || null;

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="mb-8">
          <div className="text-[10px] font-bold tracking-[0.2em] text-blood-700 mb-4 uppercase">
            04 / RESCUE ROUTE COMPOSER™
          </div>
          <h1 className="text-4xl md:text-5xl font-editorial font-bold text-ink-900 mb-4 max-w-2xl leading-tight">
            "Don't just find a route.<br/>Find the right one."
          </h1>
          <p className="text-ink-600 text-sm max-w-xl italic">
            "Compose a blood-delivery plan using urgency, availability, time and logistics constraints."
          </p>
          <p className="text-[10px] font-bold text-ink-400 mt-2 uppercase tracking-wider bg-ink-100 inline-block px-2 py-1 rounded">
            Logistics recommendation for authorized review.
          </p>
        </header>

        {networkConstraint && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6 shadow-sm">
            <h3 className="font-bold text-amber-900">NETWORK CONSTRAINT</h3>
            <p className="text-sm text-amber-800 mt-1">Available suitable demo inventory is insufficient to fulfill the requested quantity from a single source.</p>
            <p className="text-xs text-amber-700 mt-2 font-medium">Review multi-source allocation.</p>
          </div>
        )}

        {/* Main Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT: Logistics Map & Details */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            
            {/* Map Container */}
            <div className="h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-sm">
              <RouteMap 
                request={mockRouteRequest} 
                selectedRouteId={selectedRouteId} 
                isComposed={isComposed}
                selectedRouteObj={selectedRouteObj}
              />
            </div>

            {/* Route Options below map */}
            <div className="bg-white p-5 rounded-2xl border border-ink-200/50 shadow-sm">
              <h3 className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-4">Route Options</h3>
              <div className="grid grid-cols-1 gap-3">
                {mockRouteRequest.options.map((option) => {
                  const rInfo = rankedRoutes.find(r => r.route.id === option.id);
                  return (
                    <RouteOption
                      key={option.id}
                      option={option}
                      isSelected={selectedRouteId === option.id}
                      onClick={() => setSelectedRouteId(option.id)}
                      details={rInfo?.details}
                      isBest={bestRoute?.id === option.id}
                      isComposed={isComposed}
                    />
                  );
                })}
              </div>
            </div>

            {/* Route Comparison Panel */}
            {isComposed && rankedRoutes.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-ink-200/50 shadow-sm overflow-x-auto">
                <h3 className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-4">Route Comparison</h3>
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase tracking-wider text-ink-400 border-b border-ink-100">
                    <tr>
                      <th className="pb-2">Metric</th>
                      {rankedRoutes.map((r, idx) => (
                        <th key={r.route.id} className={`pb-2 px-2 text-center ${bestRoute?.id === r.route.id ? 'text-blood-700 font-bold' : ''}`}>
                          {r.route.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-50">
                    <tr>
                      <td className="py-2 font-medium text-ink-600">Stock (Units)</td>
                      {rankedRoutes.map(r => <td key={r.route.id} className="py-2 px-2 text-center">{r.route.availableUnits}</td>)}
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-ink-600">Distance (km)</td>
                      {rankedRoutes.map(r => <td key={r.route.id} className="py-2 px-2 text-center">{r.route.distanceKm}</td>)}
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-ink-600">Travel (min)</td>
                      {rankedRoutes.map(r => <td key={r.route.id} className="py-2 px-2 text-center">{r.route.travelTimeMinutes}</td>)}
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-ink-600">Expiry (h)</td>
                      {rankedRoutes.map(r => <td key={r.route.id} className="py-2 px-2 text-center">{r.route.expiryHours}</td>)}
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-ink-600">Risk</td>
                      {rankedRoutes.map(r => <td key={r.route.id} className="py-2 px-2 text-center">{r.route.risk}</td>)}
                    </tr>
                    <tr className="bg-ink-50/50">
                      <td className="py-3 font-bold text-ink-900">Fit Score</td>
                      {rankedRoutes.map(r => (
                        <td key={r.route.id} className={`py-3 px-2 text-center font-bold ${bestRoute?.id === r.route.id ? 'text-blood-700' : 'text-ink-900'}`}>
                          {r.details.isFeasible ? `${r.details.total}` : 'N/A'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

          </div>

          {/* RIGHT: Route Intelligence Panel */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <RouteIntelligence 
              request={mockRouteRequest} 
              isComposed={isComposed}
              onCompose={handleCompose}
              onReset={handleReset}
              whatIfModifiers={whatIfModifiers}
              setWhatIfModifiers={setWhatIfModifiers}
              selectedRouteObj={selectedRouteObj}
              selectedDetails={selectedDetails}
              bestRoute={bestRoute}
            />
            
            <div className="flex-grow flex flex-col justify-end">
              <RouteConstraints constraints={mockRouteConstraints} />
              <RouteScore details={selectedDetails} isComposed={isComposed} />
              <RouteExplanation details={selectedDetails} isComposed={isComposed} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
