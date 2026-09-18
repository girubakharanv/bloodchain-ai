export type BloodGroup = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
export type NodeType = 'BLOOD_BANK' | 'COLLECTION_CENTER' | 'HOSPITAL';
export type StressLevel = 'LOW' | 'WATCH' | 'HIGH' | 'CRITICAL';

export interface FacilityNode {
  id: string;
  name: string;
  type: NodeType;
  baseInventory: number;
  baseDemand: number;
  baseCapacity: number;
  connections: string[]; // IDs of connected facilities (downstream)
}

export const baseNetworkNodes: FacilityNode[] = [
  { id: 'tn-bb-01', name: 'Madurai Blood Centre', type: 'BLOOD_BANK', baseInventory: 450, baseDemand: 380, baseCapacity: 120, connections: ['tn-h-01', 'tn-h-02'] },
  { id: 'tn-bb-02', name: 'Chennai Central Blood Bank', type: 'BLOOD_BANK', baseInventory: 800, baseDemand: 750, baseCapacity: 200, connections: ['tn-h-03', 'tn-h-04', 'tn-h-05'] },
  { id: 'tn-bb-03', name: 'Coimbatore Regional Hub', type: 'BLOOD_BANK', baseInventory: 320, baseDemand: 290, baseCapacity: 80, connections: ['tn-h-06'] },
  
  { id: 'tn-cc-01', name: 'Madurai South Collection', type: 'COLLECTION_CENTER', baseInventory: 0, baseDemand: 0, baseCapacity: 50, connections: ['tn-bb-01'] },
  { id: 'tn-cc-02', name: 'Chennai North Collection', type: 'COLLECTION_CENTER', baseInventory: 0, baseDemand: 0, baseCapacity: 90, connections: ['tn-bb-02'] },
  
  { id: 'tn-h-01', name: 'Meenakshi Mission', type: 'HOSPITAL', baseInventory: 40, baseDemand: 150, baseCapacity: 0, connections: [] },
  { id: 'tn-h-02', name: 'Apollo Madurai', type: 'HOSPITAL', baseInventory: 60, baseDemand: 120, baseCapacity: 0, connections: [] },
  { id: 'tn-h-03', name: 'Rajiv Gandhi GH', type: 'HOSPITAL', baseInventory: 150, baseDemand: 400, baseCapacity: 0, connections: [] },
  { id: 'tn-h-04', name: 'Apollo Greams', type: 'HOSPITAL', baseInventory: 100, baseDemand: 200, baseCapacity: 0, connections: [] },
  { id: 'tn-h-05', name: 'MIOT', type: 'HOSPITAL', baseInventory: 80, baseDemand: 180, baseCapacity: 0, connections: [] },
  { id: 'tn-h-06', name: 'KMCH Coimbatore', type: 'HOSPITAL', baseInventory: 70, baseDemand: 220, baseCapacity: 0, connections: [] },
];

export const bloodGroups: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

// Distribution of demand by blood group (approximate TN distribution)
export const groupDistribution: Record<BloodGroup, number> = {
  'O+': 0.38,
  'O-': 0.02,
  'A+': 0.26,
  'A-': 0.02,
  'B+': 0.22,
  'B-': 0.02,
  'AB+': 0.07,
  'AB-': 0.01,
};
