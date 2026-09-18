export const heroStats = [
  { value: '183', label: 'units approaching expiry', icon: 'Clock' },
  { value: '32', label: 'predicted shortage risks', icon: 'AlertTriangle' },
  { value: '42', label: 'rescue opportunities detected', icon: 'ShieldPlus' },
];

export const overviewKPIs = [
  { value: '12,480', label: 'Current Network Stock', subtext: 'Current units' },
  { value: '10,920', label: 'Predicted 7-Day Demand', subtext: '7-day predicted demand' },
  { value: '184', label: 'Expiry Risk', subtext: 'High expiry-risk units' },
  { value: '27%', label: 'Network Stress', subtext: 'Network stress' },
];

export const previewCards = [
  {
    title: 'DEMAND',
    description: 'Predict what the network will need.',
    icon: 'LineChart'
  },
  {
    title: 'RISK',
    description: 'Identify shortages and expiry before they happen.',
    icon: 'AlertTriangle'
  },
  {
    title: 'RESCUE',
    description: 'Find opportunities to redistribute suitable inventory.',
    icon: 'Activity'
  },
  {
    title: 'RESPONSE',
    description: 'Simulate and optimize the next move.',
    icon: 'Network'
  }
];

export const criticalSignals = [
  {
    severity: 'high',
    title: 'HIGH EXPIRY RISK',
    description: '20 O+ units approaching expiry',
    time: 'Just now'
  },
  {
    severity: 'medium',
    title: 'PREDICTED SHORTAGE',
    description: 'O− demand may exceed reserve',
    time: '2h ago'
  },
  {
    severity: 'low',
    title: 'NETWORK STRESS',
    description: 'Regional demand volatility increasing',
    time: '5h ago'
  }
];

export const sidebarNavigation = [
  { name: 'Overview', active: true },
  { name: 'Demand Forecast', active: false },
  { name: 'Expiry Intelligence', active: false },
  { name: 'Network Twin', active: false },
  { name: 'Rescue Engine', active: false },
  { name: 'Dispatch', active: false },
  { name: 'Cold Chain', active: false },
  { name: 'Collection', active: false },
  { name: 'Blood Passport', active: false },
  { name: 'Decision DNA', active: false },
  { name: 'Impact', active: false },
];
