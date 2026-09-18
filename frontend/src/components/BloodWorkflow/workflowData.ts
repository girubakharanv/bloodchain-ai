export interface WorkflowStage {
  id: string;
  label: string;
  description: string;
  startProgress: number; // 0 to 1
  endProgress: number;   // 0 to 1
}

export const workflowStages: WorkflowStage[] = [
  {
    id: 'donor',
    label: '01 BLOOD DONOR',
    description: 'Every supply chain begins with a willing donor.',
    startProgress: 0,
    endProgress: 0.25,
  },
  {
    id: 'blood-bank',
    label: '02 BLOOD BANK',
    description: 'Collection becomes inventory.',
    startProgress: 0.25,
    endProgress: 0.55,
  },
  {
    id: 'transport',
    label: '03 BLOOD TRANSPORT',
    description: 'Time-sensitive logistics begins.',
    startProgress: 0.55,
    endProgress: 0.85,
  },
  {
    id: 'hospital',
    label: '04 HOSPITAL',
    description: 'Where logistics becomes readiness.',
    startProgress: 0.85,
    endProgress: 1.0,
  }
];

export const intelligenceSignals = [
  { label: 'PREDICT', progress: 0.1 },
  { label: 'OPTIMIZE', progress: 0.4 },
  { label: 'MONITOR', progress: 0.7 },
  { label: 'VERIFY', progress: 0.95 },
];
