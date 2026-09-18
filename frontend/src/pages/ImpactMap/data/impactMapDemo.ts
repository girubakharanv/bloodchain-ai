import { ImpactScenarioData } from '../types/impactMap';

export const getImpactScenarioData = (scenarioId: string): ImpactScenarioData => {
  // Default to NORMAL_NETWORK for demo purposes
  
  const baseData: ImpactScenarioData = {
    scenarioId: 'NORMAL_NETWORK',
    kpis: [
      { label: 'EXPIRY RISK', value: '−32%', trend: 'DOWN', isPositive: true },
      { label: 'MODELED SHORTAGE EXPOSURE', value: '−24%', trend: 'DOWN', isPositive: true },
      { label: 'AVERAGE ROUTE TIME', value: '−18%', trend: 'DOWN', isPositive: true },
      { label: 'ALLOCATION EFFICIENCY', value: '+21%', trend: 'UP', isPositive: true },
      { label: 'NETWORK RESILIENCE', value: '+14 pts', trend: 'UP', isPositive: true },
      { label: 'UNITS RESCUED FROM EXPIRY', value: '+18', trend: 'UP', isPositive: true }
    ],
    comparison: {
      baseline: {
        expiryPressure: 'higher expiry pressure',
        allocation: 'fragmented allocation',
        routeSelection: 'longer route selection',
        shortageExposure: 'higher modeled shortage exposure',
        resilience: 'weaker network resilience'
      },
      optimized: {
        expiryPressure: 'lower expiry pressure',
        allocation: 'coordinated allocation',
        routeSelection: 'route-fit optimization',
        shortageExposure: 'lower modeled shortage exposure',
        resilience: 'stronger resilience'
      }
    },
    regions: [
      { region: 'Chennai', baselineRisk: 'High', optimizedRisk: 'Medium', change: '−28%', primaryDriver: 'Allocation', coordinates: { x: 70, y: 20 } },
      { region: 'Coimbatore', baselineRisk: 'Medium', optimizedRisk: 'Low', change: '−22%', primaryDriver: 'Route Optimization', coordinates: { x: 30, y: 40 } },
      { region: 'Madurai', baselineRisk: 'High', optimizedRisk: 'Medium', change: '−31%', primaryDriver: 'Collection Planning', coordinates: { x: 45, y: 70 } },
      { region: 'Trichy', baselineRisk: 'Medium', optimizedRisk: 'Low', change: '−19%', primaryDriver: 'Inventory Balancing', coordinates: { x: 60, y: 50 } },
      { region: 'Salem', baselineRisk: 'High', optimizedRisk: 'Medium', change: '−24%', primaryDriver: 'Transport Optimization', coordinates: { x: 50, y: 35 } },
      { region: 'Tirunelveli', baselineRisk: 'High', optimizedRisk: 'Medium', change: '−26%', primaryDriver: 'Demand Forecast', coordinates: { x: 40, y: 85 } }
    ],
    bloodGroups: [
      { bloodGroup: 'O+', expiryRisk: 'MEDIUM', expiryRiskTrend: 'DOWN', shortageExposure: 'LOW', shortageExposureTrend: 'DOWN', allocationEfficiency: 'HIGH', allocationEfficiencyTrend: 'UP', networkPressure: 'MEDIUM' },
      { bloodGroup: 'O-', expiryRisk: 'LOW', expiryRiskTrend: 'DOWN', shortageExposure: 'MEDIUM', shortageExposureTrend: 'DOWN', allocationEfficiency: 'HIGH', allocationEfficiencyTrend: 'UP', networkPressure: 'HIGH' },
      { bloodGroup: 'A+', expiryRisk: 'LOW', expiryRiskTrend: 'NEUTRAL', shortageExposure: 'LOW', shortageExposureTrend: 'DOWN', allocationEfficiency: 'MEDIUM', allocationEfficiencyTrend: 'UP', networkPressure: 'LOW' },
      { bloodGroup: 'A-', expiryRisk: 'MEDIUM', expiryRiskTrend: 'DOWN', shortageExposure: 'MEDIUM', shortageExposureTrend: 'DOWN', allocationEfficiency: 'HIGH', allocationEfficiencyTrend: 'UP', networkPressure: 'MEDIUM' },
      { bloodGroup: 'B+', expiryRisk: 'HIGH', expiryRiskTrend: 'DOWN', shortageExposure: 'LOW', shortageExposureTrend: 'NEUTRAL', allocationEfficiency: 'MEDIUM', allocationEfficiencyTrend: 'UP', networkPressure: 'LOW' },
      { bloodGroup: 'B-', expiryRisk: 'LOW', expiryRiskTrend: 'NEUTRAL', shortageExposure: 'LOW', shortageExposureTrend: 'NEUTRAL', allocationEfficiency: 'HIGH', allocationEfficiencyTrend: 'UP', networkPressure: 'LOW' },
      { bloodGroup: 'AB+', expiryRisk: 'MEDIUM', expiryRiskTrend: 'DOWN', shortageExposure: 'LOW', shortageExposureTrend: 'NEUTRAL', allocationEfficiency: 'MEDIUM', allocationEfficiencyTrend: 'UP', networkPressure: 'LOW' },
      { bloodGroup: 'AB-', expiryRisk: 'LOW', expiryRiskTrend: 'NEUTRAL', shortageExposure: 'LOW', shortageExposureTrend: 'NEUTRAL', allocationEfficiency: 'HIGH', allocationEfficiencyTrend: 'UP', networkPressure: 'LOW' }
    ],
    attribution: [
      { name: 'BloodFlow Negotiator™', impactArea: 'Allocation Efficiency', contribution: 'HIGH CONTRIBUTION', isActive: true },
      { name: 'Expiry Echo Engine™', impactArea: 'Expiry Risk', contribution: 'HIGH CONTRIBUTION', isActive: true },
      { name: 'Rescue Route Composer™', impactArea: 'Transport Efficiency', contribution: 'MEDIUM CONTRIBUTION', isActive: true },
      { name: 'Collection Compass™', impactArea: 'Supply Availability', contribution: 'MEDIUM CONTRIBUTION', isActive: true },
      { name: 'Cold Chain Sentinel™', impactArea: 'Transport Risk', contribution: 'MEDIUM CONTRIBUTION', isActive: true },
      { name: 'Supply Stress Simulator™', impactArea: 'Network Resilience', contribution: 'HIGH CONTRIBUTION', isActive: true },
      { name: 'Decision DNA™', impactArea: 'Decision Explainability', contribution: 'CONTEXT', isActive: true },
      { name: 'Blood Passport Ledger™', impactArea: 'Traceability', contribution: 'CONTEXT', isActive: true }
    ],
    rescuedUnits: 18,
    shortageExposure: {
      baseline: 46,
      optimized: 35,
      change: -11
    },
    resilience: {
      baseline: 68,
      optimized: 82,
      change: 14
    },
    story: {
      title: 'WHAT CHANGED?',
      narrative: 'BloodChain identified rising O+ demand pressure, protected the network reserve, prioritized the highest operational need, selected a feasible rescue route, and continuously evaluated transport risk.'
    },
    timeline: [
      { timeOffset: 'NOW', description: 'Scenario modeled and baseline established' },
      { timeOffset: '+6H', description: 'Allocation stabilized across priority nodes' },
      { timeOffset: '+24H', description: 'Expiry pressure reduced via strategic redistribution' },
      { timeOffset: '+48H', description: 'Transport risk reduced with monitored cold-chain' },
      { timeOffset: '+72H', description: 'Collection gap narrowed based on predicted intelligence' },
      { timeOffset: '+7D', description: 'Network resilience improved under simulated conditions' }
    ]
  };

  // We can add minor deterministic variations for other scenarios if selected
  if (scenarioId === 'DEMAND_SURGE') {
    return {
      ...baseData,
      scenarioId: 'DEMAND_SURGE',
      kpis: [
        { label: 'EXPIRY RISK', value: '−12%', trend: 'DOWN', isPositive: true },
        { label: 'MODELED SHORTAGE EXPOSURE', value: '−45%', trend: 'DOWN', isPositive: true },
        { label: 'AVERAGE ROUTE TIME', value: '−8%', trend: 'DOWN', isPositive: true },
        { label: 'ALLOCATION EFFICIENCY', value: '+34%', trend: 'UP', isPositive: true },
        { label: 'NETWORK RESILIENCE', value: '+8 pts', trend: 'UP', isPositive: true },
        { label: 'UNITS RESCUED FROM EXPIRY', value: '+5', trend: 'UP', isPositive: true }
      ],
      rescuedUnits: 5,
      shortageExposure: {
        baseline: 89,
        optimized: 49,
        change: -40
      },
      story: {
        title: 'SURGE MITIGATION',
        narrative: 'BloodChain rapidly re-allocated reserves away from low-acuity facilities, predicting severe O- shortages during the surge, minimizing critical stockouts.'
      }
    };
  }

  return baseData;
};
