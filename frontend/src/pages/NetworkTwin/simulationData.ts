export interface Facility {
  id: string;
  name: string;
  type: 'blood-bank' | 'hospital';
  location: { x: number; y: number };
  inventory: Record<string, number>;
  capacity: number;
  status: 'normal' | 'watch' | 'stressed' | 'critical' | 'offline';
  baseDemand?: Record<string, number>; // Hospitals typically have demand
}

export interface TransportLink {
  id: string;
  sourceId: string;
  targetId: string;
  baseTravelTimeMin: number;
  status: 'normal' | 'delayed' | 'offline';
}

export interface SimulationScenario {
  demandMultiplier: number;
  collectionMultiplier: number;
  transportDelayMinutes: number;
  offlineFacilities: string[];
  emergencyMode: boolean;
}

export interface SimulationSnapshot {
  timestamp: string;
  demand: Record<string, number>;
  inventory: Record<string, number>;
  risk: Record<string, number>;
  networkStress: number;
}

export const baselineFacilities: Facility[] = [
  {
    id: 'bb-a',
    name: 'Blood Bank Alpha',
    type: 'blood-bank',
    location: { x: 50, y: 15 },
    inventory: { 'O+': 240, 'O-': 85, 'A+': 190, 'B+': 120 },
    capacity: 1000,
    status: 'normal',
  },
  {
    id: 'bb-b',
    name: 'Blood Bank Beta',
    type: 'blood-bank',
    location: { x: 50, y: 85 },
    inventory: { 'O+': 180, 'O-': 42, 'A+': 140, 'B+': 90 },
    capacity: 800,
    status: 'normal',
  },
  {
    id: 'hosp-b',
    name: 'Hospital Central',
    type: 'hospital',
    location: { x: 20, y: 50 },
    inventory: { 'O+': 82, 'O-': 24, 'A+': 60, 'B+': 40 },
    capacity: 300,
    status: 'normal',
    baseDemand: { 'O+': 40, 'O-': 12, 'A+': 30, 'B+': 20 },
  },
  {
    id: 'hosp-c',
    name: 'Hospital East',
    type: 'hospital',
    location: { x: 80, y: 50 },
    inventory: { 'O+': 96, 'O-': 31, 'A+': 75, 'B+': 45 },
    capacity: 350,
    status: 'normal',
    baseDemand: { 'O+': 45, 'O-': 15, 'A+': 35, 'B+': 25 },
  }
];

export const baselineLinks: TransportLink[] = [
  { id: 'l1', sourceId: 'bb-a', targetId: 'hosp-b', baseTravelTimeMin: 45, status: 'normal' },
  { id: 'l2', sourceId: 'bb-a', targetId: 'hosp-c', baseTravelTimeMin: 35, status: 'normal' },
  { id: 'l3', sourceId: 'bb-b', targetId: 'hosp-b', baseTravelTimeMin: 30, status: 'normal' },
  { id: 'l4', sourceId: 'bb-b', targetId: 'hosp-c', baseTravelTimeMin: 50, status: 'normal' },
];

export const defaultScenario: SimulationScenario = {
  demandMultiplier: 0,
  collectionMultiplier: 0,
  transportDelayMinutes: 0,
  offlineFacilities: [],
  emergencyMode: false
};
