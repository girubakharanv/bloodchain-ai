export type ImpactScenario = 
  | 'NORMAL_NETWORK'
  | 'DEMAND_SURGE'
  | 'SUPPLY_SHOCK'
  | 'TRANSPORT_DISRUPTION'
  | 'FACILITY_OUTAGE'
  | 'EXPIRY_WAVE';

export interface KPIImpact {
  label: string;
  value: string;
  trend: 'UP' | 'DOWN';
  isPositive: boolean; // meaning good for the network, e.g. -32% Expiry Risk is positive
}

export interface NetworkCharacteristics {
  expiryPressure: string;
  allocation: string;
  routeSelection: string;
  shortageExposure: string;
  resilience: string;
}

export interface BeforeAfterComparison {
  baseline: NetworkCharacteristics;
  optimized: NetworkCharacteristics;
}

export interface RegionalImpact {
  region: string;
  baselineRisk: 'High' | 'Medium' | 'Low';
  optimizedRisk: 'High' | 'Medium' | 'Low';
  change: string;
  primaryDriver: string;
  coordinates: { x: number; y: number }; // Relative coordinates 0-100 for the abstract map
}

export interface BloodGroupImpact {
  bloodGroup: string;
  expiryRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  expiryRiskTrend: 'DOWN' | 'UP' | 'NEUTRAL';
  shortageExposure: 'LOW' | 'MEDIUM' | 'HIGH';
  shortageExposureTrend: 'DOWN' | 'UP' | 'NEUTRAL';
  allocationEfficiency: 'LOW' | 'MEDIUM' | 'HIGH';
  allocationEfficiencyTrend: 'UP' | 'DOWN' | 'NEUTRAL';
  networkPressure: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AttributionModule {
  name: string;
  impactArea: string;
  contribution: 'HIGH CONTRIBUTION' | 'MEDIUM CONTRIBUTION' | 'LOW CONTRIBUTION' | 'CONTEXT';
  isActive: boolean;
}

export interface ShortageExposureMetrics {
  baseline: number;
  optimized: number;
  change: number;
}

export interface ResilienceScoreMetrics {
  baseline: number;
  optimized: number;
  change: number;
}

export interface TimelineEvent {
  timeOffset: string;
  description: string;
}

export interface ImpactScenarioData {
  scenarioId: ImpactScenario;
  kpis: KPIImpact[];
  comparison: BeforeAfterComparison;
  regions: RegionalImpact[];
  bloodGroups: BloodGroupImpact[];
  attribution: AttributionModule[];
  rescuedUnits: number;
  shortageExposure: ShortageExposureMetrics;
  resilience: ResilienceScoreMetrics;
  story: {
    title: string;
    narrative: string;
  };
  timeline: TimelineEvent[];
}

// Stubs for future Part B integration
export interface ExpiryImpactInput {}
export interface AllocationImpactInput {}
export interface RouteImpactInput {}
export interface ColdChainImpactInput {}
export interface CollectionImpactInput {}
export interface StressImpactInput {}
export interface NetworkTwinImpactInput {}
export interface LedgerImpactInput {}
export interface DecisionImpactInput {}
