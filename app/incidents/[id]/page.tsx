import { notFound } from 'next/navigation';

import { IncidentDetail } from '@/components/incidents/IncidentDetail';
import { fetchIncident } from '@/lib/api';
import { Incident } from '@/lib/types';

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let incident: Incident;

  try {
    incident = await fetchIncident(id);
  } catch {
    notFound();
  }

  return <IncidentDetail incident={incident} />;
}
