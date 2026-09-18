import { Shipment } from '../../../data/coldChainData';
import { SentinelAlert } from '../../../data/coldChainData';

export interface ScoreComponent {
  name: string;
  score: number;       // 0 to 100 for this specific component
  weight: number;      // e.g., 0.3 for 30%
  weightedScore: number; // score * weight
}

export interface SentinelScoreDetails {
  totalScore: number; // 0 to 100
  riskLevel: 'LOW' | 'WATCH' | 'HIGH' | 'CRITICAL';
  components: ScoreComponent[];
  topDriver: ScoreComponent;
  temperatureTrendText: 'RISING' | 'STABLE' | 'FALLING';
}

const WEIGHTS = {
  temperatureCondition: 0.30,
  temperatureTrend: 0.20,
  transportDuration: 0.15,
  battery: 0.10,
  doorEvents: 0.10,
  connectivity: 0.05,
  sensorHealth: 0.05,
  routeStatus: 0.05
};

// Helper to convert "HH:MM:SS" or "MM min" to minutes
export const parseDurationToMinutes = (timeStr: string): number => {
  if (timeStr.includes('min')) {
    return parseInt(timeStr.replace(/\D/g, ''), 10) || 0;
  }
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
};

// Risk Calculations (returning 0 to 100 risk score)

const calculateTemperatureRisk = (temp: number, min: number, max: number): number => {
  const mid = (min + max) / 2;
  const range = (max - min) / 2;
  
  const diff = Math.abs(temp - mid);
  
  if (diff <= range * 0.5) return 10; // Very safe, near middle
  if (diff <= range * 0.8) return 40; // Moderate
  if (diff <= range) return 75;       // Approaching threshold
  return 100;                         // Exceeded
};

const calculateTemperatureTrendRisk = (shipment: Shipment): { risk: number, trendText: 'RISING' | 'STABLE' | 'FALLING' } => {
  const history = shipment.temperatureHistory;
  if (history.length < 2) return { risk: 20, trendText: 'STABLE' };
  
  const recent = history.slice(-3); // look at last 3 points
  if (recent.length < 2) return { risk: 20, trendText: 'STABLE' };

  let rises = 0;
  let falls = 0;
  
  for (let i = 1; i < recent.length; i++) {
    if (recent[i].temp > recent[i-1].temp) rises++;
    else if (recent[i].temp < recent[i-1].temp) falls++;
  }
  
  let trendText: 'RISING' | 'STABLE' | 'FALLING' = 'STABLE';
  if (rises > 0 && falls === 0) trendText = 'RISING';
  if (falls > 0 && rises === 0) trendText = 'FALLING';

  const currentTemp = shipment.temperature;
  const max = shipment.targetRangeMax;
  const min = shipment.targetRangeMin;

  // If rising toward max, high risk. If falling toward min, high risk.
  let risk = 20;
  if (trendText === 'RISING' && currentTemp > (min + max) / 2) {
    risk = 85;
  } else if (trendText === 'FALLING' && currentTemp < (min + max) / 2) {
    risk = 85;
  }

  return { risk, trendText };
};

const calculateTransportDurationRisk = (minutes: number): number => {
  if (minutes < 60) return 10;
  if (minutes < 120) return 40;
  if (minutes < 180) return 75;
  return 100;
};

const calculateBatteryRisk = (battery: number): number => {
  if (battery > 60) return 10;
  if (battery >= 30) return 40;
  if (battery >= 15) return 75;
  return 100;
};

const calculateDoorRisk = (doorStatus: string, events: any[]): number => {
  let risk = doorStatus === 'SECURE' ? 10 : 80;
  
  // Check for repeated events
  const doorEvents = events.filter(e => e.event.toLowerCase().includes('door'));
  if (doorEvents.length > 2) {
    risk = Math.max(risk, 90);
  }
  
  return risk;
};

const calculateConnectivityRisk = (gpsStatus: string): number => {
  if (gpsStatus === 'CONNECTED') return 10;
  if (gpsStatus === 'DEGRADED' || gpsStatus === 'SEARCHING') return 60;
  if (gpsStatus === 'OFFLINE') return 100;
  return 50;
};

const calculateSensorHealthRisk = (deviceStatus: string): number => {
  if (deviceStatus === 'HEALTHY') return 10;
  if (deviceStatus === 'WARNING') return 60;
  if (deviceStatus === 'DEGRADED') return 80;
  if (deviceStatus === 'OFFLINE') return 100;
  return 50;
};

const calculateRouteStatusRisk = (status: string): number => {
  const s = status.toUpperCase();
  if (s.includes('DELAY')) return 75;
  if (s === 'IN TRANSIT') return 20;
  if (s === 'ARRIVING') return 10;
  return 20;
};

export const getRiskLevel = (score: number): 'LOW' | 'WATCH' | 'HIGH' | 'CRITICAL' => {
  if (score < 25) return 'LOW';
  if (score < 50) return 'WATCH';
  if (score < 75) return 'HIGH';
  return 'CRITICAL';
};

export const getOperationalRecommendation = (level: string): string => {
  switch (level) {
    case 'LOW': return 'Continue routine monitoring.';
    case 'WATCH': return 'Increase monitoring attention and review the latest transport conditions.';
    case 'HIGH': return 'Operational review recommended. Inspect current shipment conditions.';
    case 'CRITICAL': return 'Immediate operational review recommended by authorized logistics/blood-bank personnel.';
    default: return 'Routine monitoring.';
  }
};

export const calculateSentinelRisk = (shipment: Shipment): SentinelScoreDetails => {
  const durationMin = parseDurationToMinutes(shipment.transportTime);
  
  const tempRisk = calculateTemperatureRisk(shipment.temperature, shipment.targetRangeMin, shipment.targetRangeMax);
  const { risk: trendRisk, trendText } = calculateTemperatureTrendRisk(shipment);
  const durRisk = calculateTransportDurationRisk(durationMin);
  const battRisk = calculateBatteryRisk(shipment.battery);
  const doorRisk = calculateDoorRisk(shipment.doorStatus, shipment.events);
  const connRisk = calculateConnectivityRisk(shipment.gpsStatus);
  const sensRisk = calculateSensorHealthRisk(shipment.deviceStatus);
  const routeRisk = calculateRouteStatusRisk(shipment.routeStatus);

  const components: ScoreComponent[] = [
    { name: 'Temperature Condition', score: tempRisk, weight: WEIGHTS.temperatureCondition, weightedScore: tempRisk * WEIGHTS.temperatureCondition },
    { name: 'Temperature Trend', score: trendRisk, weight: WEIGHTS.temperatureTrend, weightedScore: trendRisk * WEIGHTS.temperatureTrend },
    { name: 'Transport Duration', score: durRisk, weight: WEIGHTS.transportDuration, weightedScore: durRisk * WEIGHTS.transportDuration },
    { name: 'Battery', score: battRisk, weight: WEIGHTS.battery, weightedScore: battRisk * WEIGHTS.battery },
    { name: 'Door Events', score: doorRisk, weight: WEIGHTS.doorEvents, weightedScore: doorRisk * WEIGHTS.doorEvents },
    { name: 'Connectivity', score: connRisk, weight: WEIGHTS.connectivity, weightedScore: connRisk * WEIGHTS.connectivity },
    { name: 'Sensor Health', score: sensRisk, weight: WEIGHTS.sensorHealth, weightedScore: sensRisk * WEIGHTS.sensorHealth },
    { name: 'Route Status', score: routeRisk, weight: WEIGHTS.routeStatus, weightedScore: routeRisk * WEIGHTS.routeStatus }
  ];

  const totalScore = Math.round(components.reduce((acc, curr) => acc + curr.weightedScore, 0));
  
  // Sort descending by weighted contribution to find top driver
  const sortedComponents = [...components].sort((a, b) => b.weightedScore - a.weightedScore);
  const topDriver = sortedComponents[0];

  return {
    totalScore,
    riskLevel: getRiskLevel(totalScore),
    components: sortedComponents, // Ordered by contribution
    topDriver,
    temperatureTrendText: trendText
  };
};

export const generateSentinelAlerts = (shipments: Shipment[]): SentinelAlert[] => {
  const alerts: SentinelAlert[] = [];
  
  shipments.forEach(s => {
    const details = calculateSentinelRisk(s);
    const issues = [];
    let isCombined = false;
    
    // Check multiple specific conditions
    if ((details.components.find(c => c.name === 'Temperature Trend')?.score ?? 0) >= 75) {
      issues.push('Temperature trend ↑');
    }
    if ((details.components.find(c => c.name === 'Temperature Condition')?.score ?? 0) >= 75) {
      issues.push('Temperature condition');
    }
    if ((details.components.find(c => c.name === 'Transport Duration')?.score ?? 0) >= 75) {
      issues.push('Transport duration ↑');
    }
    if ((details.components.find(c => c.name === 'Battery')?.score ?? 0) >= 75) {
      issues.push('Battery ↓');
    }
    if ((details.components.find(c => c.name === 'Connectivity')?.score ?? 0) >= 60) {
      issues.push('Connectivity ↓');
    }

    if (issues.length >= 2) {
      // COMBINED SIGNAL
      alerts.push({
        id: `alert-comb-${s.id}`,
        type: 'COMBINED SENTINEL SIGNAL',
        message: `Multiple logistics conditions are converging on shipment ${s.id}.\n\nFactors: ${issues.join(' | ')}`,
        shipmentId: s.id
      } as any); // using cast as we added COMBINED to types conceptually
      isCombined = true;
    }

    // If not combined, output individual meaningful alerts
    if (!isCombined) {
      if ((details.components.find(c => c.name === 'Temperature Trend')?.score ?? 0) >= 75) {
        alerts.push({
          id: `alert-tt-${s.id}`,
          type: 'TEMPERATURE WATCH' as any,
          message: `${s.id} is trending toward the configured monitoring boundary.`,
          shipmentId: s.id
        });
      }
      else if ((details.components.find(c => c.name === 'Battery')?.score ?? 0) >= 75) {
        alerts.push({
          id: `alert-batt-${s.id}`,
          type: 'BATTERY WATCH' as any,
          message: `${s.id} device battery is approaching a low-power state and requires attention.`,
          shipmentId: s.id
        });
      }
      else if ((details.components.find(c => c.name === 'Door Events')?.score ?? 0) >= 75) {
        alerts.push({
          id: `alert-door-${s.id}`,
          type: 'DOOR EVENT' as any,
          message: `${s.id} recorded a door-open event.`,
          shipmentId: s.id
        });
      }
      else if ((details.components.find(c => c.name === 'Connectivity')?.score ?? 0) >= 60) {
        alerts.push({
          id: `alert-conn-${s.id}`,
          type: 'CONNECTIVITY' as any,
          message: `${s.id} monitoring connectivity is degraded.`,
          shipmentId: s.id
        });
      }
    }
  });

  return alerts;
};
