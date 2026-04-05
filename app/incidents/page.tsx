import { fetchIncidents } from '@/lib/api';
import { IncidentTable } from '@/components/incidents/IncidentTable';

export default async function IncidentsPage() {
    const incidents = await fetchIncidents();
  return (
    <main className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Incidents</h1>
        <p className="text-muted-foreground mt-1">
          Real-time Kubernetes incident diagnostics
        </p>
      </div>
      <IncidentTable incidents={incidents} />
    </main>
  );
}