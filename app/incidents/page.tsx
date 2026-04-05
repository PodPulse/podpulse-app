import { fetchIncidents } from '@/lib/api';
import { IncidentsClient } from './IncidentsClient';

export default async function IncidentsPage() {
  const incidents = await fetchIncidents();
  return <IncidentsClient initialIncidents={incidents} />;
}