import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IncidentStatusBadge } from './IncidentStatusBadge';
import { Incident } from '@/lib/types';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function IncidentTable({ incidents }: { incidents: Incident[] }) {
  if (incidents.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        No incidents detected yet.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Pod</TableHead>
            <TableHead>Namespace</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Detected</TableHead>
            <TableHead>PR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow key={incident.id}>
              <TableCell>
                <IncidentStatusBadge status={incident.status} />
              </TableCell>
              <TableCell className="font-mono text-sm">
                {incident.incidentType}
              </TableCell>
              <TableCell>
                <Link
                  href={`/incidents/${incident.id}`}
                  className="font-medium hover:underline"
                >
                  {incident.podName}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {incident.namespace}
              </TableCell>
              <TableCell>
                {incident.confidenceScore !== null
                  ? `${Math.round(incident.confidenceScore * 100)}%`
                  : '—'}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(incident.detectedAt)}
              </TableCell>
              <TableCell>
                {incident.prUrl ? (
                  <a
                    href={incident.prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View PR →
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}