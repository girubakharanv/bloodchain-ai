export interface TemperaturePoint {
  time: string;
  temp: number;
}

export interface SensorEvent {
  time: string;
  event: string;
  source: string;
  status: 'NORMAL' | 'SECURE' | 'WARNING';
}

export interface ChainEvent {
  time: string;
  event: string;
}

export interface SentinelAlert {
  id: string;
  type: 'TEMPERATURE WATCH' | 'BATTERY WATCH' | 'DOOR EVENT' | 'CONNECTIVITY' | 'ROUTE DELAY' | 'COMBINED SENTINEL SIGNAL';
  message: string;
  shipmentId: string;
}

export interface Shipment {
  id: string;
  source: string;
  destination: string;
  temperature: number;
  targetRangeMin: number;
  targetRangeMax: number;
  battery: number;
  doorStatus: 'SECURE' | 'OPEN';
  gpsStatus: 'CONNECTED' | 'SEARCHING';
  deviceStatus: 'HEALTHY' | 'WARNING';
  transportTime: string;
  routeStatus: 'IN TRANSIT' | 'ARRIVING' | 'DISPATCHED';
  riskStatus: 'LOW' | 'WATCH' | 'HIGH';
  lastUpdateDate: string; // ISO string or relative for display
  temperatureHistory: TemperaturePoint[];
  events: SensorEvent[];
  chainTimeline: ChainEvent[];
}

export const mockShipments: Shipment[] = [
  {
    id: 'BC-TR-2048',
    source: 'Madurai Blood Centre',
    destination: 'Regional Hospital',
    temperature: 4.2,
    targetRangeMin: 2,
    targetRangeMax: 6,
    battery: 87,
    doorStatus: 'SECURE',
    gpsStatus: 'CONNECTED',
    deviceStatus: 'HEALTHY',
    transportTime: '01:18:42',
    routeStatus: 'IN TRANSIT',
    riskStatus: 'LOW',
    lastUpdateDate: '12 sec ago',
    temperatureHistory: [
      { time: '08:40', temp: 3.8 },
      { time: '08:55', temp: 4.1 },
      { time: '09:10', temp: 4.4 },
      { time: '09:25', temp: 5.1 },
      { time: '09:40', temp: 5.8 },
      { time: '09:55', temp: 5.4 },
      { time: '10:10', temp: 4.7 },
      { time: '10:25', temp: 4.2 },
    ],
    events: [
      { time: '09:42:18', event: 'Temperature update', source: 'Sensor', status: 'NORMAL' },
      { time: '09:41:56', event: 'GPS update', source: 'Vehicle', status: 'NORMAL' },
      { time: '09:40:32', event: 'Battery update', source: 'Device', status: 'NORMAL' },
      { time: '09:39:11', event: 'Door status', source: 'Sensor', status: 'SECURE' },
    ],
    chainTimeline: [
      { time: '08:42', event: 'Shipment loaded' },
      { time: '08:48', event: 'Container sealed' },
      { time: '08:51', event: 'Vehicle dispatched' },
      { time: '09:17', event: 'Temperature check' },
      { time: '09:38', event: 'Route checkpoint' },
    ]
  },
  {
    id: 'BC-TR-2049',
    source: 'Central Blood Bank',
    destination: 'Government Hospital',
    temperature: 5.6,
    targetRangeMin: 2,
    targetRangeMax: 6,
    battery: 64,
    doorStatus: 'SECURE',
    gpsStatus: 'CONNECTED',
    deviceStatus: 'HEALTHY',
    transportTime: '02:05:11',
    routeStatus: 'IN TRANSIT',
    riskStatus: 'WATCH',
    lastUpdateDate: '45 sec ago',
    temperatureHistory: [
      { time: '07:30', temp: 4.0 },
      { time: '08:00', temp: 4.5 },
      { time: '08:30', temp: 4.8 },
      { time: '09:00', temp: 5.2 },
      { time: '09:30', temp: 5.6 },
    ],
    events: [],
    chainTimeline: []
  },
  {
    id: 'BC-TR-2050',
    source: 'District Blood Centre',
    destination: 'Emergency Hospital',
    temperature: 3.9,
    targetRangeMin: 2,
    targetRangeMax: 6,
    battery: 92,
    doorStatus: 'OPEN',
    gpsStatus: 'CONNECTED',
    deviceStatus: 'HEALTHY',
    transportTime: '00:42:15',
    routeStatus: 'IN TRANSIT',
    riskStatus: 'LOW',
    lastUpdateDate: '2 sec ago',
    temperatureHistory: [
      { time: '09:30', temp: 3.9 }
    ],
    events: [],
    chainTimeline: []
  },
  {
    id: 'BC-TR-2051',
    source: 'Regional Centre',
    destination: 'City Hospital',
    temperature: 5.8,
    targetRangeMin: 2,
    targetRangeMax: 6,
    battery: 22,
    doorStatus: 'SECURE',
    gpsStatus: 'CONNECTED',
    deviceStatus: 'HEALTHY',
    transportTime: '142 min',
    routeStatus: 'IN TRANSIT',
    riskStatus: 'WATCH',
    lastUpdateDate: '3 min ago',
    temperatureHistory: [
      { time: '06:00', temp: 4.2 },
      { time: '07:00', temp: 4.8 },
      { time: '08:00', temp: 5.5 },
      { time: '09:00', temp: 5.1 },
      { time: '10:00', temp: 5.8 },
    ],
    events: [],
    chainTimeline: []
  }
];

export const mockAlerts: SentinelAlert[] = [
  {
    id: 'alert-1',
    type: 'TEMPERATURE WATCH',
    message: 'Shipment BC-TR-2049 is approaching the configured monitoring threshold.',
    shipmentId: 'BC-TR-2049'
  },
  {
    id: 'alert-2',
    type: 'BATTERY WATCH',
    message: 'Shipment BC-TR-2051 battery level requires attention.',
    shipmentId: 'BC-TR-2051'
  },
  {
    id: 'alert-3',
    type: 'DOOR EVENT',
    message: 'Shipment BC-TR-2050 recorded a door-open event.',
    shipmentId: 'BC-TR-2050'
  }
];
