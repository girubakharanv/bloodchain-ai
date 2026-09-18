export type RegionName = 'Madurai' | 'Chennai' | 'Coimbatore' | 'Trichy' | 'Salem' | 'Tirunelveli';
export type BloodGroup = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
export type HorizonHours = 24 | 48 | 72 | 168; // 168 = 7 days
export type PriorityLevel = 'LOW' | 'WATCH' | 'HIGH' | 'CRITICAL';

export interface ForecastPoint {
  hoursOffset: number; // 0, 24, 48, 72
  forecastDemand: number;
  currentStockProjection: number; // What stock will be assuming no new collection
}

export interface RegionData {
  name: RegionName;
  baseCollectionCapacity: number; // units per day
  currentStock: Record<BloodGroup, number>;
  forecastDemand: Record<HorizonHours, Record<BloodGroup, number>>; // Total demand over that horizon
  forecastCurve: Record<BloodGroup, ForecastPoint[]>; // Time series
  expiryExposure: number; // Score or raw units exposing to expiry
  regionalPressureScore: number; // 0-100 baseline pressure
}

// Deterministic mock data
export const mockCollectionData: RegionData[] = [
  {
    name: 'Madurai',
    baseCollectionCapacity: 120, // units/day
    currentStock: {
      'O+': 280, 'O-': 40, 'A+': 180, 'A-': 25, 'B+': 150, 'B-': 15, 'AB+': 45, 'AB-': 5
    },
    forecastDemand: {
      24: { 'O+': 150, 'O-': 20, 'A+': 80, 'A-': 10, 'B+': 70, 'B-': 5, 'AB+': 15, 'AB-': 2 },
      48: { 'O+': 320, 'O-': 45, 'A+': 170, 'A-': 22, 'B+': 145, 'B-': 12, 'AB+': 35, 'AB-': 4 },
      72: { 'O+': 490, 'O-': 65, 'A+': 250, 'A-': 35, 'B+': 220, 'B-': 18, 'AB+': 55, 'AB-': 6 },
      168: { 'O+': 950, 'O-': 130, 'A+': 490, 'A-': 70, 'B+': 450, 'B-': 40, 'AB+': 110, 'AB-': 15 },
    },
    forecastCurve: {
      'O+': [
        { hoursOffset: 0, forecastDemand: 0, currentStockProjection: 280 },
        { hoursOffset: 24, forecastDemand: 150, currentStockProjection: 250 },
        { hoursOffset: 48, forecastDemand: 320, currentStockProjection: 190 },
        { hoursOffset: 72, forecastDemand: 490, currentStockProjection: 110 }
      ],
      'O-': [
        { hoursOffset: 0, forecastDemand: 0, currentStockProjection: 40 },
        { hoursOffset: 24, forecastDemand: 20, currentStockProjection: 35 },
        { hoursOffset: 48, forecastDemand: 45, currentStockProjection: 20 },
        { hoursOffset: 72, forecastDemand: 65, currentStockProjection: 5 }
      ],
      'A+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 180 }, { hoursOffset: 72, forecastDemand: 250, currentStockProjection: 100 }],
      'A-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 25 }, { hoursOffset: 72, forecastDemand: 35, currentStockProjection: 10 }],
      'B+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 150 }, { hoursOffset: 72, forecastDemand: 220, currentStockProjection: 80 }],
      'B-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 15 }, { hoursOffset: 72, forecastDemand: 18, currentStockProjection: 5 }],
      'AB+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 45 }, { hoursOffset: 72, forecastDemand: 55, currentStockProjection: 20 }],
      'AB-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 5 }, { hoursOffset: 72, forecastDemand: 6, currentStockProjection: 2 }]
    },
    expiryExposure: 45,
    regionalPressureScore: 70
  },
  {
    name: 'Chennai',
    baseCollectionCapacity: 300,
    currentStock: {
      'O+': 510, 'O-': 85, 'A+': 420, 'A-': 50, 'B+': 380, 'B-': 45, 'AB+': 120, 'AB-': 15
    },
    forecastDemand: {
      24: { 'O+': 180, 'O-': 30, 'A+': 150, 'A-': 20, 'B+': 130, 'B-': 15, 'AB+': 40, 'AB-': 5 },
      48: { 'O+': 380, 'O-': 65, 'A+': 310, 'A-': 45, 'B+': 270, 'B-': 30, 'AB+': 85, 'AB-': 10 },
      72: { 'O+': 620, 'O-': 110, 'A+': 490, 'A-': 70, 'B+': 440, 'B-': 50, 'AB+': 135, 'AB-': 18 },
      168: { 'O+': 1250, 'O-': 210, 'A+': 1000, 'A-': 150, 'B+': 890, 'B-': 105, 'AB+': 280, 'AB-': 40 },
    },
    forecastCurve: {
      'O+': [
        { hoursOffset: 0, forecastDemand: 0, currentStockProjection: 510 },
        { hoursOffset: 24, forecastDemand: 180, currentStockProjection: 450 },
        { hoursOffset: 48, forecastDemand: 380, currentStockProjection: 360 },
        { hoursOffset: 72, forecastDemand: 620, currentStockProjection: 220 }
      ],
      'O-': [
        { hoursOffset: 0, forecastDemand: 0, currentStockProjection: 85 },
        { hoursOffset: 24, forecastDemand: 30, currentStockProjection: 75 },
        { hoursOffset: 48, forecastDemand: 65, currentStockProjection: 50 },
        { hoursOffset: 72, forecastDemand: 110, currentStockProjection: 10 }
      ],
      'A+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 420 }, { hoursOffset: 72, forecastDemand: 490, currentStockProjection: 150 }],
      'A-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 50 }, { hoursOffset: 72, forecastDemand: 70, currentStockProjection: 15 }],
      'B+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 380 }, { hoursOffset: 72, forecastDemand: 440, currentStockProjection: 120 }],
      'B-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 45 }, { hoursOffset: 72, forecastDemand: 50, currentStockProjection: 10 }],
      'AB+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 120 }, { hoursOffset: 72, forecastDemand: 135, currentStockProjection: 40 }],
      'AB-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 15 }, { hoursOffset: 72, forecastDemand: 18, currentStockProjection: 5 }]
    },
    expiryExposure: 85,
    regionalPressureScore: 60
  },
  {
    name: 'Coimbatore',
    baseCollectionCapacity: 180,
    currentStock: {
      'O+': 360, 'O-': 50, 'A+': 210, 'A-': 30, 'B+': 190, 'B-': 20, 'AB+': 65, 'AB-': 8
    },
    forecastDemand: {
      24: { 'O+': 110, 'O-': 15, 'A+': 65, 'A-': 10, 'B+': 60, 'B-': 5, 'AB+': 20, 'AB-': 2 },
      48: { 'O+': 240, 'O-': 35, 'A+': 140, 'A-': 22, 'B+': 130, 'B-': 12, 'AB+': 42, 'AB-': 5 },
      72: { 'O+': 390, 'O-': 55, 'A+': 225, 'A-': 35, 'B+': 210, 'B-': 18, 'AB+': 68, 'AB-': 8 },
      168: { 'O+': 750, 'O-': 110, 'A+': 440, 'A-': 70, 'B+': 410, 'B-': 35, 'AB+': 130, 'AB-': 15 },
    },
    forecastCurve: {
      'O+': [
        { hoursOffset: 0, forecastDemand: 0, currentStockProjection: 360 },
        { hoursOffset: 24, forecastDemand: 110, currentStockProjection: 320 },
        { hoursOffset: 48, forecastDemand: 240, currentStockProjection: 250 },
        { hoursOffset: 72, forecastDemand: 390, currentStockProjection: 150 }
      ],
      'O-': [
        { hoursOffset: 0, forecastDemand: 0, currentStockProjection: 50 },
        { hoursOffset: 24, forecastDemand: 15, currentStockProjection: 42 },
        { hoursOffset: 48, forecastDemand: 35, currentStockProjection: 28 },
        { hoursOffset: 72, forecastDemand: 55, currentStockProjection: 8 }
      ],
      'A+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 210 }, { hoursOffset: 72, forecastDemand: 225, currentStockProjection: 90 }],
      'A-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 30 }, { hoursOffset: 72, forecastDemand: 35, currentStockProjection: 10 }],
      'B+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 190 }, { hoursOffset: 72, forecastDemand: 210, currentStockProjection: 70 }],
      'B-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 20 }, { hoursOffset: 72, forecastDemand: 18, currentStockProjection: 5 }],
      'AB+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 65 }, { hoursOffset: 72, forecastDemand: 68, currentStockProjection: 25 }],
      'AB-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 8 }, { hoursOffset: 72, forecastDemand: 8, currentStockProjection: 2 }]
    },
    expiryExposure: 35,
    regionalPressureScore: 40
  },
  {
    name: 'Trichy',
    baseCollectionCapacity: 140,
    currentStock: {
      'O+': 260, 'O-': 35, 'A+': 180, 'A-': 20, 'B+': 150, 'B-': 15, 'AB+': 40, 'AB-': 5
    },
    forecastDemand: {
      24: { 'O+': 60, 'O-': 10, 'A+': 45, 'A-': 5, 'B+': 40, 'B-': 5, 'AB+': 10, 'AB-': 1 },
      48: { 'O+': 130, 'O-': 22, 'A+': 95, 'A-': 12, 'B+': 85, 'B-': 10, 'AB+': 22, 'AB-': 2 },
      72: { 'O+': 220, 'O-': 38, 'A+': 155, 'A-': 20, 'B+': 140, 'B-': 16, 'AB+': 36, 'AB-': 4 },
      168: { 'O+': 450, 'O-': 75, 'A+': 310, 'A-': 40, 'B+': 290, 'B-': 32, 'AB+': 75, 'AB-': 8 },
    },
    forecastCurve: {
      'O+': [
        { hoursOffset: 0, forecastDemand: 0, currentStockProjection: 260 },
        { hoursOffset: 24, forecastDemand: 60, currentStockProjection: 240 },
        { hoursOffset: 48, forecastDemand: 130, currentStockProjection: 190 },
        { hoursOffset: 72, forecastDemand: 220, currentStockProjection: 140 }
      ],
      'O-': [
        { hoursOffset: 0, forecastDemand: 0, currentStockProjection: 35 },
        { hoursOffset: 24, forecastDemand: 10, currentStockProjection: 30 },
        { hoursOffset: 48, forecastDemand: 22, currentStockProjection: 22 },
        { hoursOffset: 72, forecastDemand: 38, currentStockProjection: 12 }
      ],
      'A+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 180 }, { hoursOffset: 72, forecastDemand: 155, currentStockProjection: 90 }],
      'A-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 20 }, { hoursOffset: 72, forecastDemand: 20, currentStockProjection: 5 }],
      'B+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 150 }, { hoursOffset: 72, forecastDemand: 140, currentStockProjection: 70 }],
      'B-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 15 }, { hoursOffset: 72, forecastDemand: 16, currentStockProjection: 5 }],
      'AB+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 40 }, { hoursOffset: 72, forecastDemand: 36, currentStockProjection: 15 }],
      'AB-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 5 }, { hoursOffset: 72, forecastDemand: 4, currentStockProjection: 2 }]
    },
    expiryExposure: 60,
    regionalPressureScore: 25
  },
  {
    name: 'Salem',
    baseCollectionCapacity: 100,
    currentStock: {
      'O+': 210, 'O-': 25, 'A+': 140, 'A-': 15, 'B+': 110, 'B-': 10, 'AB+': 30, 'AB-': 4
    },
    forecastDemand: {
      24: { 'O+': 55, 'O-': 8, 'A+': 35, 'A-': 4, 'B+': 30, 'B-': 3, 'AB+': 8, 'AB-': 1 },
      48: { 'O+': 115, 'O-': 16, 'A+': 75, 'A-': 9, 'B+': 65, 'B-': 7, 'AB+': 18, 'AB-': 2 },
      72: { 'O+': 185, 'O-': 26, 'A+': 120, 'A-': 15, 'B+': 105, 'B-': 11, 'AB+': 28, 'AB-': 3 },
      168: { 'O+': 380, 'O-': 55, 'A+': 240, 'A-': 30, 'B+': 215, 'B-': 22, 'AB+': 58, 'AB-': 7 },
    },
    forecastCurve: {
      'O+': [
        { hoursOffset: 0, forecastDemand: 0, currentStockProjection: 210 },
        { hoursOffset: 24, forecastDemand: 55, currentStockProjection: 195 },
        { hoursOffset: 48, forecastDemand: 115, currentStockProjection: 155 },
        { hoursOffset: 72, forecastDemand: 185, currentStockProjection: 100 }
      ],
      'O-': [
        { hoursOffset: 0, forecastDemand: 0, currentStockProjection: 25 },
        { hoursOffset: 24, forecastDemand: 8, currentStockProjection: 22 },
        { hoursOffset: 48, forecastDemand: 16, currentStockProjection: 15 },
        { hoursOffset: 72, forecastDemand: 26, currentStockProjection: 6 }
      ],
      'A+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 140 }, { hoursOffset: 72, forecastDemand: 120, currentStockProjection: 65 }],
      'A-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 15 }, { hoursOffset: 72, forecastDemand: 15, currentStockProjection: 5 }],
      'B+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 110 }, { hoursOffset: 72, forecastDemand: 105, currentStockProjection: 45 }],
      'B-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 10 }, { hoursOffset: 72, forecastDemand: 11, currentStockProjection: 3 }],
      'AB+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 30 }, { hoursOffset: 72, forecastDemand: 28, currentStockProjection: 10 }],
      'AB-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 4 }, { hoursOffset: 72, forecastDemand: 3, currentStockProjection: 1 }]
    },
    expiryExposure: 20,
    regionalPressureScore: 35
  },
  {
    name: 'Tirunelveli',
    baseCollectionCapacity: 90,
    currentStock: {
      'O+': 180, 'O-': 20, 'A+': 110, 'A-': 12, 'B+': 95, 'B-': 8, 'AB+': 25, 'AB-': 3
    },
    forecastDemand: {
      24: { 'O+': 50, 'O-': 6, 'A+': 30, 'A-': 4, 'B+': 25, 'B-': 2, 'AB+': 6, 'AB-': 1 },
      48: { 'O+': 105, 'O-': 13, 'A+': 65, 'A-': 8, 'B+': 55, 'B-': 5, 'AB+': 14, 'AB-': 2 },
      72: { 'O+': 170, 'O-': 21, 'A+': 105, 'A-': 13, 'B+': 90, 'B-': 8, 'AB+': 22, 'AB-': 3 },
      168: { 'O+': 350, 'O-': 45, 'A+': 210, 'A-': 26, 'B+': 185, 'B-': 16, 'AB+': 46, 'AB-': 6 },
    },
    forecastCurve: {
      'O+': [
        { hoursOffset: 0, forecastDemand: 0, currentStockProjection: 180 },
        { hoursOffset: 24, forecastDemand: 50, currentStockProjection: 165 },
        { hoursOffset: 48, forecastDemand: 105, currentStockProjection: 125 },
        { hoursOffset: 72, forecastDemand: 170, currentStockProjection: 80 }
      ],
      'O-': [
        { hoursOffset: 0, forecastDemand: 0, currentStockProjection: 20 },
        { hoursOffset: 24, forecastDemand: 6, currentStockProjection: 18 },
        { hoursOffset: 48, forecastDemand: 13, currentStockProjection: 12 },
        { hoursOffset: 72, forecastDemand: 21, currentStockProjection: 5 }
      ],
      'A+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 110 }, { hoursOffset: 72, forecastDemand: 105, currentStockProjection: 50 }],
      'A-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 12 }, { hoursOffset: 72, forecastDemand: 13, currentStockProjection: 4 }],
      'B+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 95 }, { hoursOffset: 72, forecastDemand: 90, currentStockProjection: 40 }],
      'B-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 8 }, { hoursOffset: 72, forecastDemand: 8, currentStockProjection: 2 }],
      'AB+': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 25 }, { hoursOffset: 72, forecastDemand: 22, currentStockProjection: 8 }],
      'AB-': [{ hoursOffset: 0, forecastDemand: 0, currentStockProjection: 3 }, { hoursOffset: 72, forecastDemand: 3, currentStockProjection: 1 }]
    },
    expiryExposure: 30,
    regionalPressureScore: 45
  }
];
