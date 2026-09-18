import { BloodUnit } from '../data/bloodPassportData';

export interface ExpiryContext {
  riskScore: number;
  riskLevel: 'LOW' | 'WATCH' | 'HIGH';
}

export interface ColdChainContext {
  temperature: number;
  battery: number;
  sentinelRisk: number;
  doorState: 'SECURE' | 'OPEN';
  status: 'MONITORED' | 'UNMONITORED';
}

export interface RouteContext {
  routeId: string;
  source: string;
  destination: string;
  routeFit: number;
  status: 'READY' | 'IN TRANSIT' | 'COMPLETED';
}

export interface AllocationContext {
  allocationId: string;
  destination: string;
  status: 'NOT ALLOCATED' | 'ALLOCATED' | 'RESERVED' | 'DISPATCHED' | 'DELIVERED';
}

export interface NetworkContext {
  currentFacility: string;
  networkRegion: string;
  stressLevel: 'NORMAL' | 'ELEVATED' | 'SEVERE';
}

export const getUnitExpiryContext = (unit: BloodUnit): ExpiryContext => {
  // Mock data mapping
  const daysToExpiry = Math.floor((new Date(unit.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  let riskLevel: 'LOW' | 'WATCH' | 'HIGH' = 'LOW';
  let riskScore = 12;

  if (unit.currentState === 'EXPIRED') {
    riskLevel = 'HIGH';
    riskScore = 100;
  } else if (daysToExpiry < 7) {
    riskLevel = 'HIGH';
    riskScore = 85;
  } else if (daysToExpiry < 14) {
    riskLevel = 'WATCH';
    riskScore = 55;
  }

  return { riskScore, riskLevel };
};

export const getUnitColdChainContext = (unit: BloodUnit): ColdChainContext | null => {
  if (['DISPATCHED', 'IN TRANSIT', 'ARRIVED'].includes(unit.currentState)) {
    return {
      temperature: unit.bloodGroup.includes('-') ? 2.8 : 4.2, // Arbitrary determinism
      battery: 87,
      sentinelRisk: 32,
      doorState: 'SECURE',
      status: 'MONITORED'
    };
  }
  return null;
};

export const getUnitRouteContext = (unit: BloodUnit): RouteContext | null => {
  if (['ALLOCATED', 'DISPATCHED', 'IN TRANSIT', 'ARRIVED'].includes(unit.currentState)) {
    return {
      routeId: `RTE-${unit.id.substring(unit.id.length - 4)}`,
      source: unit.source,
      destination: unit.destination,
      routeFit: 91,
      status: unit.currentState === 'ARRIVED' ? 'COMPLETED' : unit.currentState === 'IN TRANSIT' ? 'IN TRANSIT' : 'READY'
    };
  }
  return null;
};

export const getUnitAllocationContext = (unit: BloodUnit): AllocationContext | null => {
  if (['ALLOCATED', 'DISPATCHED', 'IN TRANSIT', 'ARRIVED'].includes(unit.currentState)) {
    return {
      allocationId: `ALLOC-${unit.id.substring(unit.id.length - 4)}`,
      destination: unit.destination,
      status: unit.currentState === 'ARRIVED' ? 'DELIVERED' : unit.currentState === 'DISPATCHED' ? 'DISPATCHED' : 'ALLOCATED'
    };
  }
  return {
    allocationId: '',
    destination: '',
    status: 'NOT ALLOCATED'
  };
};

export const getUnitNetworkContext = (unit: BloodUnit): NetworkContext => {
  return {
    currentFacility: unit.currentLocation,
    networkRegion: 'Southern Region',
    stressLevel: unit.bloodGroup === 'O-' ? 'ELEVATED' : 'NORMAL'
  };
};
