export type CaseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type EvidenceCategory = 'visual' | 'sensor' | 'maintenance' | 'material' | 'witness';

export interface VisualEvidence {
  imageUrl?: string;
  imagePrompt?: string; // Prompt used to describe what it looks like if generated
  description: string;
  hasZoom: boolean;
  zoomDetails?: string; // High magnification micrograph details
  annotations?: { x: number; y: number; label: string }[];
}

export interface SensorDataPoint {
  time: string;
  value: number;
  [key: string]: string | number;
}

export interface SensorEvidence {
  chartTitle: string;
  xAxisLabel: string;
  yAxisLabel: string;
  dataPoints: SensorDataPoint[];
  description: string;
  unit: string;
}

export interface MaintenanceLogEntry {
  date: string;
  action: string;
  technician: string;
  notes: string;
  flagged?: boolean;
}

export interface MaterialProperty {
  elementOrProperty: string;
  specified: string;
  actual: string;
  status: 'Pass' | 'Fail' | 'Marginal';
}

export interface MaterialEvidence {
  alloyName: string;
  properties: MaterialProperty[];
  microhardness?: string;
  notes: string;
}

export interface WitnessStatement {
  witnessName: string;
  role: string;
  statement: string;
}

export interface EvidenceCard {
  id: string;
  name: string;
  category: EvidenceCategory;
  cost: number;
  redHerring: boolean;
  shortSummary: string; // Brief description before unlocking
  unlocked?: boolean;
  
  // Specific payload types based on category
  visualData?: VisualEvidence;
  sensorData?: SensorEvidence;
  maintenanceData?: MaintenanceLogEntry[];
  materialData?: MaterialEvidence;
  witnessData?: WitnessStatement;
}

export interface Case {
  id: string;
  title: string;
  system: string;
  field: string;
  majorCaseType: string;
  difficulty: CaseDifficulty;
  ambiguity: number; // 1-5 scale
  redHerringDensity: number; // 1-5 scale
  shortDescription: string;
  briefing: string;
  startingBudget: number;
  correctCauseId: string;
  taxonomyCauses: { id: string; name: string; description: string }[];
  evidence: EvidenceCard[];
  citation: string;
  causalChain: string;
  hintPool: string[];
  officialResourceUrl?: string;
  resourceTitle?: string;
}

export interface Hypothesis {
  id: string;
  timestamp: string;
  text: string;
  unlockedEvidenceCount: number;
}

export interface CompletedCaseSession {
  caseId: string;
  completedAt: string;
  score: number;
  suspectedCauseId: string;
  justification: string;
  hypotheses: Hypothesis[];
  unlockedEvidenceIds: string[];
  pointsSpent: number;
  correct: boolean;
  gradingFeedback?: string;
  gradingScore?: number;
}

export interface UserProfile {
  name: string;
  role: 'student' | 'engineer' | 'instructor';
  institution?: string;
  history: CompletedCaseSession[];
  totalScore: number;
}
