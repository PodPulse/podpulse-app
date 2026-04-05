import { Incident } from './types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5051';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? '';

const headers = {
  'x-api-key': API_KEY,
  'Content-Type': 'application/json',
};

export async function fetchIncidents(limit = 50): Promise<Incident[]> {
  const res = await fetch(`${BACKEND_URL}/api/incidents?limit=${limit}`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch incidents: ${res.status}`);
  return res.json();
}

export async function fetchIncident(id: string): Promise<Incident> {
  const res = await fetch(`${BACKEND_URL}/api/incidents/${id}`, {
    headers,
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch incident: ${res.status}`);
  return res.json();
}