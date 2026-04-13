export type IncidentStatus =
  | 'received'
  | 'diagnosing'
  | 'diagnosed'
  | 'pr_opened'
  | 'pr_updated'
  | 'below_threshold'
  | 'error';

export type PrStatus = 'none' | 'opened' | 'merged' | 'closed';

export type IncidentType = 'OomKilled' | 'CrashLoopBackOff';

export interface Incident {
  id: string;
  clusterId: string;
  incidentType: IncidentType;
  namespace: string;
  podName: string;
  nodeName: string;
  restartCount: number;
  rawContext: string;
  detectedAt: string; // ISO 8601

  // Diagnostic
  detection: string | null;
  rootCause: string | null;
  proposedFix: string | null;
  confidenceScore: number | null;

  // Workload
  workloadName: string | null;
  workloadKind: string | null;

  // Manifest resolution
  confidencePenaltyReason: string | null;

  // PR
  prUrl: string | null;
  prStatus: PrStatus;

  // Lifecycle
  status: IncidentStatus;
  errorMessage: string | null;

  createdAt: string; // ISO 8601
}