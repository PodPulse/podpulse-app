import { Incident, IncidentStatus, PrStatus } from './types';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5051';
const API_KEY = process.env.API_KEY ?? '';

const headers = {
  'x-api-key': API_KEY,
  'Content-Type': 'application/json',
};

const STATUS_MAP: Record<string, IncidentStatus> = {
  propened: 'pr_opened',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeIncident(raw: any): Incident {
  return {
    ...raw,
    status: STATUS_MAP[raw.status] ?? (raw.status as IncidentStatus),
    prUrl: raw.prUrl ?? null,
    prStatus: ((raw.prStatus ?? 'none') as string).toLowerCase() as PrStatus,
  };
}

export async function fetchIncidents(limit = 50): Promise<Incident[]> {
  const res = await fetch(`${BACKEND_URL}/api/incidents?limit=${limit}`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch incidents: ${res.status}`);
  return (await res.json()).map(normalizeIncident);
}

export async function fetchIncident(id: string): Promise<Incident> {
  const res = await fetch(`${BACKEND_URL}/api/incidents/${id}`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch incident: ${res.status}`);
  return normalizeIncident(await res.json());
}
