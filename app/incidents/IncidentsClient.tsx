'use client';

import { useState, useCallback } from 'react';
import { Incident } from '@/lib/types';
import { IncidentTable } from '@/components/incidents/IncidentTable';
import { useIncidentStream } from '@/hooks/useIncidentStream';

export function IncidentsClient({
  initialIncidents,
}: {
  initialIncidents: Incident[];
}) {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);

  const handleNewIncident = useCallback((incident: Incident) => {
    setIncidents((prev) => {
      const exists = prev.find((i) => i.id === incident.id);
      if (exists) {
        return prev.map((i) => (i.id === incident.id ? incident : i));
      }
      return [incident, ...prev];
    });
  }, []);

  useIncidentStream(handleNewIncident);

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