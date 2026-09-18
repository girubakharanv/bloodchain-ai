export type UnitState = 'COLLECTED' | 'PROCESSING' | 'STORED' | 'ALLOCATED' | 'DISPATCHED' | 'IN TRANSIT' | 'ARRIVED' | 'EXPIRED' | 'QUARANTINED';
export type BloodGroup = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
export type ComponentType = 'PRBC' | 'FFP' | 'PLT' | 'CRY';

export interface LedgerEvent {
  id: string;
  timestamp: string; // ISO or human readable for demo
  event: string;
  location: string;
  actor: string;
  status: 'VERIFIED' | 'PENDING' | 'EXCEPTION';
  recordId: string;
  previousRecordId: string | null;
}

export interface CustodyTransfer {
  id: string;
  timestamp: string;
  fromLocation: string;
  toLocation: string;
  event: string;
  status: 'VERIFIED' | 'EXCEPTION';
}

export interface BloodUnit {
  id: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  collectionDate: string;
  expiryDate: string;
  source: string;
  destination: string;
  currentLocation: string;
  currentState: UnitState;
  events: LedgerEvent[];
  custodyTransfers: CustodyTransfer[];
  traceabilityScore: number;
}

// ------------------------------------------------------------------
// HELPER FOR DETERMINISTIC HASH GENERATION (MOCK)
// ------------------------------------------------------------------
const mockHash = (prefix: string, seed: number) => {
  const chars = '0123456789ABCDEF';
  let hash = '';
  let val = Math.abs(Math.sin(seed) * 1000000);
  for(let i=0; i<8; i++) {
    hash += chars[Math.floor(val) % 16];
    val = (val * 17) + 3;
  }
  return `${prefix}-${hash}`;
};

// ------------------------------------------------------------------
// DETERMINISTIC MOCK UNITS
// ------------------------------------------------------------------
const createMockUnit = (
  id: string, 
  bloodGroup: BloodGroup, 
  component: ComponentType, 
  state: UnitState, 
  source: string, 
  destination: string,
  progressScore: number,
  seedOffset: number
): BloodUnit => {
  
  const events: LedgerEvent[] = [];
  const custodyTransfers: CustodyTransfer[] = [];
  
  let currentRecId = mockHash('BCL', seedOffset);
  
  const addEvent = (eventStr: string, location: string, actor: string, hr: string, addCustody?: {to: string}) => {
    const prevId = currentRecId;
    currentRecId = mockHash('BCL', seedOffset + events.length + 1);
    
    events.push({
      id: `EVT-${id.slice(-4)}-${events.length + 1}`,
      timestamp: hr,
      event: eventStr,
      location,
      actor,
      status: 'VERIFIED',
      recordId: currentRecId,
      previousRecordId: prevId
    });
    
    if (addCustody) {
      custodyTransfers.push({
        id: `CST-${id.slice(-4)}-${custodyTransfers.length + 1}`,
        timestamp: hr,
        fromLocation: location,
        toLocation: addCustody.to,
        event: `${eventStr} VERIFIED`,
        status: 'VERIFIED'
      });
    }
  };

  // Base Lifecycle (Depends on progress score 1-7)
  if (progressScore >= 1) addEvent('COLLECTION', source, 'Collection System', '08:42');
  if (progressScore >= 2) addEvent('PROCESSING', source, 'Processing Unit', '10:15');
  if (progressScore >= 3) addEvent('STORAGE', source, 'Cold Storage A', '11:20');
  
  if (state === 'QUARANTINED') {
     addEvent('QUARANTINED', source, 'QA System', '12:00');
  } else if (state === 'EXPIRED') {
     addEvent('EXPIRED', source, 'Expiry Echo Engine', '23:59');
  } else {
    if (progressScore >= 4) addEvent('ALLOCATED', source, 'Regional Allocation Desk', '13:10');
    if (progressScore >= 5) addEvent('DISPATCH', source, 'Logistics System', '13:32', { to: 'Transport Vehicle 07' });
    if (progressScore >= 6) addEvent('TRANSIT UPDATE', 'Route R-04', 'Transport Device', '14:05');
    if (progressScore >= 7) addEvent('ARRIVED', destination, 'Receiving Bay', '15:45', { to: destination });
  }

  let currentLocation = source;
  if (progressScore === 5) currentLocation = 'Dispatch Bay';
  if (progressScore === 6) currentLocation = 'Transport Vehicle 07';
  if (progressScore === 7) currentLocation = destination;

  // Derive dates deterministically
  const colDate = new Date("2026-06-14");
  const expDate = new Date("2026-06-18"); // PRBC usually 35 days, but using brief window for demo impact

  return {
    id,
    bloodGroup,
    component,
    collectionDate: '14 JUN 2026',
    expiryDate: '18 JUN 2026',
    source,
    destination,
    currentLocation,
    currentState: state,
    events,
    custodyTransfers,
    traceabilityScore: Math.round((progressScore / 7) * 100)
  };
};

export const demoUnits: BloodUnit[] = [
  createMockUnit('BC-O-POS-2048-731', 'O+', 'PRBC', 'IN TRANSIT', 'Madurai Blood Centre', 'Regional Hospital', 6, 1000),
  createMockUnit('BC-A-POS-2048-412', 'A+', 'PRBC', 'STORED', 'Chennai Blood Hub', 'City Clinic', 3, 2000),
  createMockUnit('BC-B-POS-2048-891', 'B+', 'PRBC', 'ALLOCATED', 'Coimbatore Centre', 'Trauma Centre A', 4, 3000),
  createMockUnit('BC-O-NEG-2048-112', 'O-', 'PRBC', 'DISPATCHED', 'Trichy Logistics', 'Surgical Ward', 5, 4000),
  createMockUnit('BC-AB-POS-2048-904', 'AB+', 'FFP', 'ARRIVED', 'Madurai Blood Centre', 'Regional Hospital', 7, 5000),
  createMockUnit('BC-A-NEG-2048-221', 'A-', 'PLT', 'EXPIRED', 'Chennai Blood Hub', 'Regional Hospital', 3, 6000),
  createMockUnit('BC-O-POS-2048-662', 'O+', 'PRBC', 'QUARANTINED', 'Coimbatore Centre', 'Pending QA', 3, 7000),
  createMockUnit('BC-B-NEG-2048-333', 'B-', 'CRY', 'COLLECTED', 'Trichy Logistics', 'Processing Hub', 1, 8000),
  createMockUnit('BC-O-POS-2048-732', 'O+', 'PRBC', 'PROCESSING', 'Madurai Blood Centre', 'Storage Unit', 2, 9000),
  createMockUnit('BC-AB-NEG-2048-999', 'AB-', 'PRBC', 'STORED', 'Chennai Blood Hub', 'Storage Unit', 3, 10000),
];
