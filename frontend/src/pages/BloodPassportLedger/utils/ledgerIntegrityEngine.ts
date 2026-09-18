import { BloodUnit, LedgerEvent } from '../data/bloodPassportData';

export interface VerificationResult {
  valid: boolean;
  recordsChecked: number;
  recordsValid: number;
  recordsInvalid: number;
  invalidEvents: string[]; // Event IDs that failed validation
  firstMismatchIndex: number | null;
  explanation: string;
}

// Ensure stable serialization for hashing
const serializeEventForHash = (unitId: string, event: LedgerEvent, overridePreviousHash?: string): string => {
  return JSON.stringify({
    unitId,
    eventId: event.id,
    timestamp: event.timestamp,
    eventType: event.event,
    location: event.location,
    actor: event.actor,
    previousHash: overridePreviousHash ?? event.previousRecordId ?? '0000000000000000'
  });
};

// Asynchronous Web Crypto SHA-256 hash
export const generateRecordHash = async (unitId: string, event: LedgerEvent, overridePreviousHash?: string): Promise<string> => {
  const canonicalString = serializeEventForHash(unitId, event, overridePreviousHash);
  
  // Encode string as UTF-8
  const msgUint8 = new TextEncoder().encode(canonicalString);
  
  // Hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  
  // Convert buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return truncated hash for UI readability, prefix with BCL (BloodChain Ledger)
  return `BCL-${hashHex.substring(0, 12).toUpperCase()}`;
};

// Rebuilds all hashes for a unit (used to generate valid chains)
export const rebuildLedgerChain = async (unitId: string, events: LedgerEvent[]): Promise<LedgerEvent[]> => {
  const newEvents = [...events];
  let previousHash = '0000000000000000'; // Genesis

  for (let i = 0; i < newEvents.length; i++) {
    const event = { ...newEvents[i], previousRecordId: previousHash };
    const hash = await generateRecordHash(unitId, event, previousHash);
    
    event.recordId = hash;
    newEvents[i] = event;
    previousHash = hash;
  }
  
  return newEvents;
};

export const verifyLedgerChain = async (unit: BloodUnit): Promise<VerificationResult> => {
  const result: VerificationResult = {
    valid: true,
    recordsChecked: unit.events.length,
    recordsValid: 0,
    recordsInvalid: 0,
    invalidEvents: [],
    firstMismatchIndex: null,
    explanation: 'All recorded lifecycle events have valid hash links and consistent unit identity.'
  };

  if (unit.events.length === 0) {
    return result; // Nothing to check
  }

  let expectedPreviousHash = '0000000000000000'; // Genesis

  for (let i = 0; i < unit.events.length; i++) {
    const event = unit.events[i];
    let isEventValid = true;

    // 1. Check previous hash linkage
    if (event.previousRecordId !== expectedPreviousHash) {
      isEventValid = false;
      if (result.firstMismatchIndex === null) {
        result.firstMismatchIndex = i;
        result.explanation = `Record ${event.id} linkage broken. Expected previous hash to be ${expectedPreviousHash}, but found ${event.previousRecordId}.`;
      }
    }

    // 2. Check current hash correctness
    const expectedCurrentHash = await generateRecordHash(unit.id, event, event.previousRecordId ?? '0000000000000000');
    if (expectedCurrentHash !== event.recordId) {
      isEventValid = false;
      if (result.firstMismatchIndex === null) {
        result.firstMismatchIndex = i;
        result.explanation = `Record ${event.id} no longer matches its stored hash, breaking the linked ledger sequence.`;
      }
    }
    
    // 3. Timeline Chronology Check (Simplistic HH:MM check for demo)
    if (i > 0) {
      const prevTimeStr = unit.events[i-1].timestamp.replace(':', '');
      const currTimeStr = event.timestamp.replace(':', '');
      if (parseInt(currTimeStr) < parseInt(prevTimeStr)) {
        isEventValid = false;
        if (result.firstMismatchIndex === null) {
          result.firstMismatchIndex = i;
          result.explanation = `Timeline gap/order error detected at ${event.id}. Timestamp is earlier than previous record.`;
        }
      }
    }

    if (isEventValid) {
      result.recordsValid++;
    } else {
      result.valid = false;
      result.recordsInvalid++;
      result.invalidEvents.push(event.id);
    }
    
    // The *stored* record ID is what the next record expects (even if it's invalid)
    // Actually, in a blockchain, if this hash is invalid, the next expects the INVALID hash to connect to it.
    expectedPreviousHash = event.recordId; 
  }

  return result;
};
