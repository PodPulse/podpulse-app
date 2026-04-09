import { cookies } from 'next/headers';
import { Incident } from './types';
import { normalizeIncident } from './normalizers';

export { normalizeIncident };

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5051';

async function authHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get('pp_auth')?.value;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function fetchIncidents(limit = 50): Promise<Incident[]> {
  const res = await fetch(`${BACKEND_URL}/api/incidents?limit=${limit}`, {
    headers: await authHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch incidents: ${res.status}`);
  return (await res.json()).map(normalizeIncident);
}

export async function fetchIncident(id: string): Promise<Incident> {
  const res = await fetch(`${BACKEND_URL}/api/incidents/${id}`, {
    headers: await authHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch incident: ${res.status}`);
  return normalizeIncident(await res.json());
}
