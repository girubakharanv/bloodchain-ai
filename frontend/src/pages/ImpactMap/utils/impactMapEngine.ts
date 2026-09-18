import { ImpactScenario, ImpactScenarioData } from '../types/impactMap';
import { fetchModuleOutputs } from './impactMapIntegration';
import { getImpactScenarioData as getDemoData } from '../data/impactMapDemo';

export const generateImpactAnalysis = (scenario: ImpactScenario): ImpactScenarioData => {
  const outputs = fetchModuleOutputs(scenario);
  const baseDemo = getDemoData(scenario); // We use this as a fallback for missing data

  // 1. Calculate KPIs based on the engine outputs where possible

  // Expiry Risk
  // We calculate expiry risk change based on Expiry Echo Engine.
  const baselineExpiryExposure = 100; // arbitrary base scale
  const optimizedExpiryExposure = Math.max(0, 100 - outputs.expiry.unitsRescued); 
  const expiryChange = ((optimizedExpiryExposure - baselineExpiryExposure) / baselineExpiryExposure) * 100;
  
  // Shortage Exposure
  // Derived from Supply Stress Simulator
  const shortageChange = outputs.stress.metrics.shortageExposure.delta; // usually a positive number representing change
  const baselineShortage = outputs.stress.metrics.shortageExposure.baseline;
  const optimizedShortage = outputs.stress.metrics.shortageExposure.current;
  const shortagePercentChange = baselineShortage > 0 ? ((optimizedShortage - baselineShortage) / baselineShortage) * 100 : 0;

  // Average Route Time
  // Derived from Rescue Route
  const baselineRouteTime = 120; // assumed baseline mins
  const optimizedRouteTime = outputs.rescueRoute.estimatedTimeMinutes;
  const routeTimeChange = ((optimizedRouteTime - baselineRouteTime) / baselineRouteTime) * 100;

  // Allocation Efficiency
  // Derived from BloodFlow
  const allocationEfficiencyChange = outputs.bloodFlow.metrics.allocationEfficiency - 60; // assume 60 is baseline

  // Network Resilience
  // Derived from Supply Stress
  const resilienceChange = outputs.stress.metrics.networkResilience.current - outputs.stress.metrics.networkResilience.baseline;

  // Units Rescued
  const rescuedUnits = outputs.expiry.unitsRescued;

  // Format KPIs
  const kpis = [
    { 
      label: 'EXPIRY RISK', 
      value: `${expiryChange > 0 ? '+' : ''}${Math.round(expiryChange)}%`, 
      trend: expiryChange <= 0 ? 'DOWN' as const : 'UP' as const, 
      isPositive: expiryChange <= 0 
    },
    { 
      label: 'MODELED SHORTAGE EXPOSURE', 
      value: `${shortagePercentChange > 0 ? '+' : ''}${Math.round(shortagePercentChange)}%`, 
      trend: shortagePercentChange <= 0 ? 'DOWN' as const : 'UP' as const, 
      isPositive: shortagePercentChange <= 0 
    },
    { 
      label: 'AVERAGE ROUTE TIME', 
      value: `${routeTimeChange > 0 ? '+' : ''}${Math.round(routeTimeChange)}%`, 
      trend: routeTimeChange <= 0 ? 'DOWN' as const : 'UP' as const, 
      isPositive: routeTimeChange <= 0 
    },
    { 
      label: 'ALLOCATION EFFICIENCY', 
      value: `${allocationEfficiencyChange > 0 ? '+' : ''}${Math.round(allocationEfficiencyChange)}%`, 
      trend: allocationEfficiencyChange >= 0 ? 'UP' as const : 'DOWN' as const, 
      isPositive: allocationEfficiencyChange >= 0 
    },
    { 
      label: 'NETWORK RESILIENCE', 
      value: `${resilienceChange > 0 ? '+' : ''}${Math.round(resilienceChange)} pts`, 
      trend: resilienceChange >= 0 ? 'UP' as const : 'DOWN' as const, 
      isPositive: resilienceChange >= 0 
    },
    { 
      label: 'UNITS RESCUED FROM EXPIRY', 
      value: `+${rescuedUnits}`, 
      trend: 'UP' as const, 
      isPositive: true 
    }
  ];

  // 2. Determine Story based on Decision DNA and Network Twin
  let title = 'WHAT CHANGED?';
  let narrative = outputs.decision.explanation.narrative || 'BloodChain intelligently analyzed the network state and optimized routes and allocation to mitigate supply stress.';
  
  if (scenario === 'DEMAND_SURGE') {
    title = 'SURGE MITIGATION';
  } else if (scenario === 'SUPPLY_SHOCK') {
    title = 'SUPPLY PROTECTION';
  } else if (scenario === 'TRANSPORT_DISRUPTION') {
    title = 'ROUTE ADAPTATION';
  }

  // Build the attribution dynamically based on which modules had the most impact
  const attribution = baseDemo.attribution.map(attr => {
    let contribution: 'HIGH CONTRIBUTION' | 'MEDIUM CONTRIBUTION' | 'LOW CONTRIBUTION' | 'CONTEXT' = attr.contribution;
    
    // Dynamically adjust contribution based on scenario
    if (scenario === 'TRANSPORT_DISRUPTION') {
      if (attr.name.includes('Rescue Route')) contribution = 'HIGH CONTRIBUTION';
      if (attr.name.includes('Cold Chain')) contribution = 'HIGH CONTRIBUTION';
    } else if (scenario === 'DEMAND_SURGE') {
      if (attr.name.includes('BloodFlow')) contribution = 'HIGH CONTRIBUTION';
      if (attr.name.includes('Network Twin')) contribution = 'HIGH CONTRIBUTION';
    }
    
    return { ...attr, contribution };
  });

  return {
    ...baseDemo,
    scenarioId: scenario,
    kpis,
    rescuedUnits,
    shortageExposure: {
      baseline: baselineShortage,
      optimized: optimizedShortage,
      change: optimizedShortage - baselineShortage
    },
    resilience: {
      baseline: outputs.stress.metrics.networkResilience.baseline,
      optimized: outputs.stress.metrics.networkResilience.current,
      change: resilienceChange
    },
    story: {
      title,
      narrative
    },
    attribution
  };
};
