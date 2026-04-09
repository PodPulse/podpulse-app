import { Incident, IncidentStatus, PrStatus } from './types';

const STATUS_MAP: Record<string, IncidentStatus> = {
  propened: 'pr_opened',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeIncident(raw: any): Incident {
  return {
    ...raw,
    status: STATUS_MAP[raw.status] ?? (raw.status as IncidentStatus),
    prUrl:   raw.prUrl ?? null,
    prStatus: ((raw.prStatus ?? 'none') as string).toLowerCase() as PrStatus,
  };
}
