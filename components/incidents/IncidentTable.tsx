import Link from 'next/link';
import { ArrowUpRight, Boxes, Clock3, RotateCcw, Server } from 'lucide-react';

import { ConfidenceIndicator } from '@/components/incidents/ConfidenceIndicator';
import { IncidentStatusBadge } from '@/components/incidents/IncidentStatusBadge';
import { PullRequestBadge } from '@/components/incidents/PullRequestBadge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatIncidentDate } from '@/lib/incident-ui';
import { Incident } from '@/lib/types';

export function IncidentTable({ incidents }: { incidents: Incident[] }) {
  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl icon-blue">
          <Boxes className="size-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-[-0.04em] text-foreground">
            No incidents in the queue
          </h2>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            PodPulse is connected and listening. New Kubernetes incidents will
            appear here as soon as the stream emits them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="pl-6">Incident</TableHead>
          <TableHead>Signal</TableHead>
          <TableHead>Confidence</TableHead>
          <TableHead>Detected</TableHead>
          <TableHead className="pr-6 text-right">Pull request</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidents.map((incident) => {
          const prStatus =
            incident.prUrl && incident.prStatus === 'none'
              ? 'opened'
              : incident.prStatus;

          return (
            <TableRow key={incident.id} className="group">
              <TableCell className="pl-6">
                <div className="min-w-[250px] space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/incidents/${incident.id}`}
                      className="inline-flex items-center gap-1.5 text-base font-semibold tracking-[-0.03em] text-foreground transition-colors group-hover:text-blue-700"
                    >
                      {incident.podName}
                      <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                    <span className="badge-ns">
                      {incident.namespace}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Server className="size-3.5" />
                      {incident.nodeName}
                    </span>
                    <span className="badge-type-pill inline-flex items-center gap-1.5">
                      {incident.incidentType}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-3">
                  <IncidentStatusBadge status={incident.status} compact />
                  <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <RotateCcw className="size-3.5" />
                    Restarts {incident.restartCount}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <ConfidenceIndicator score={incident.confidenceScore} compact />
              </TableCell>

              <TableCell>
                <div className="space-y-2 text-sm">
                  <div className="inline-flex items-center gap-1.5 text-foreground">
                    <Clock3 className="size-3.5 text-muted-foreground" />
                    {formatIncidentDate(incident.detectedAt)}
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Cluster {incident.clusterId.slice(0, 8)}
                  </p>
                </div>
              </TableCell>

              <TableCell className="pr-6">
                <div className="flex min-w-[190px] flex-col items-end gap-2">
                  <PullRequestBadge status={prStatus} />
                  {incident.prUrl ? (
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={incident.prUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View PR
                        <ArrowUpRight className="size-4" />
                      </a>
                    </Button>
                  ) : (
                    <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Awaiting remediation
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
