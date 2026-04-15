'use client';

import { useCallback, useState } from 'react';
import {
  Activity,
  Bot,
  GitPullRequest,
  GitPullRequestArrow,
  Layers,
  ServerCog,
} from 'lucide-react';

import { AgentStatusCard } from '@/components/incidents/AgentStatusCard';
import { IncidentTable } from '@/components/incidents/IncidentTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIncidentStream } from '@/hooks/useIncidentStream';
import { Incident } from '@/lib/types';

function formatAverageConfidence(incidents: Incident[]) {
  const scored = incidents.filter((incident) => incident.confidenceScore !== null);

  if (scored.length === 0) {
    return 'Pending';
  }

  const total = scored.reduce(
    (sum, incident) => sum + (incident.confidenceScore ?? 0),
    0
  );

  return `${Math.round((total / scored.length) * 100)}%`;
}

export function IncidentsClient({
  initialIncidents,
}: {
  initialIncidents: Incident[];
}) {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);

  const handleNewIncident = useCallback((incident: Incident) => {
    setIncidents((prev) => {
      const exists = prev.find((item) => item.id === incident.id);
      if (exists) {
        return prev.map((item) => (item.id === incident.id ? incident : item));
      }

      return [incident, ...prev];
    });
  }, []);

  useIncidentStream(handleNewIncident);

  const liveCount = incidents.filter(
    (incident) => incident.status === 'received' || incident.status === 'diagnosing'
  ).length;
  const prOpenedCount = incidents.filter(
    (incident) => incident.prUrl || incident.prStatus === 'opened'
  ).length;
  const namespaceCount = new Set(incidents.map((incident) => incident.namespace)).size;
  const averageConfidence = formatAverageConfidence(incidents);

  const stats = [
    {
      label: 'Live queue',
      value: `${liveCount}`,
      description: 'Incidents still moving through analysis.',
      icon: Activity,
    },
    {
      label: 'AI diagnostics',
      value: `${incidents.filter((incident) => incident.detection).length}`,
      description: 'Events enriched with root cause analysis.',
      icon: Bot,
    },
    {
      label: 'PRs opened',
      value: `${prOpenedCount}`,
      description: 'Pull requests ready for review in your repo.',
      icon: GitPullRequestArrow,
    },
    {
      label: 'Average confidence',
      value: averageConfidence,
      description: `${namespaceCount} namespaces currently represented.`,
      icon: ServerCog,
    },
    {
      label: 'Queue depth',
      value: `${incidents.length}`,
      description: 'Active incident records in the workspace.',
      icon: Layers,
    }
  ];

  return (
    <main className="flex-1 py-8 sm:py-10">
      <div className="page-shell space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, description, icon: Icon }) => (
            <Card key={label} size="sm">
              <CardHeader>
                <div className="mb-2 flex size-11 items-center justify-center rounded-2xl icon-blue">
                  <Icon className="size-5" />
                </div>
                <p className="technical-label">{label}</p>
                <CardTitle className="text-3xl">{value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
          <AgentStatusCard />
        </section>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/70 pb-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <p className="eyebrow">Incident stream</p>
                <CardTitle className="text-2xl">Live diagnostics queue</CardTitle>
              </div>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                Prioritized by PodPulse as incidents are received, diagnosed, and
                promoted to pull requests.
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <IncidentTable incidents={incidents} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
