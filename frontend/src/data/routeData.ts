export interface RouteFacility {
  id: string;
  name: string;
  type: 'BLOOD_BANK' | 'HOSPITAL';
  bloodType?: string;
  productType?: string;
  requestedUnits?: number;
  timeConstraintMinutes?: number;
  timeConstraintText?: string;
  localStock?: number;
  status: 'READY' | 'URGENT';
}

export interface RouteOption {
  id: string;
  name: string;
  sourceName: string;
  distanceKm: number;
  travelTimeMinutes: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  expiryHours: number;
  availableUnits: number;
}

export interface RouteRequest {
  destination: RouteFacility;
  options: RouteOption[];
  // Fallback source for map rendering if needed before logic is fully dynamic
  source?: RouteFacility; 
}

export interface RouteConstraint {
  timeWindow: string;
  distance: string;
  temperature: string;
  quantity: string;
  expiryWindow: string;
}

export const mockRouteRequest: RouteRequest = {
  source: {
    id: 'bb-placeholder',
    name: 'NETWORK SOURCES',
    type: 'BLOOD_BANK',
    bloodType: 'O+',
    productType: 'PRBC',
    status: 'READY'
  },
  destination: {
    id: 'hosp-1',
    name: 'HOSPITAL A',
    type: 'HOSPITAL',
    bloodType: 'O+',
    productType: 'PRBC',
    requestedUnits: 12,
    timeConstraintMinutes: 120, // 2 hours
    timeConstraintText: 'WITHIN 2 HOURS',
    localStock: 3,
    status: 'URGENT'
  },
  options: [
    {
      id: 'route-a',
      name: 'ROUTE A',
      sourceName: 'Blood Bank A',
      distanceKm: 8.4,
      travelTimeMinutes: 24,
      risk: 'LOW',
      expiryHours: 48,
      availableUnits: 24
    },
    {
      id: 'route-b',
      name: 'ROUTE B',
      sourceName: 'Blood Bank B',
      distanceKm: 6.2,
      travelTimeMinutes: 31,
      risk: 'MEDIUM',
      expiryHours: 72,
      availableUnits: 18
    },
    {
      id: 'route-c',
      name: 'ROUTE C',
      sourceName: 'Blood Bank C',
      distanceKm: 10.1,
      travelTimeMinutes: 22,
      risk: 'LOW',
      expiryHours: 24,
      availableUnits: 30
    }
  ]
};

export const mockRouteConstraints: RouteConstraint = {
  timeWindow: '2 HOURS',
  distance: '--',
  temperature: 'CONTROLLED',
  quantity: '12 UNITS',
  expiryWindow: '--'
};
