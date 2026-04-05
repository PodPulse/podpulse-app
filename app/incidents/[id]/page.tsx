import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchIncident } from '@/lib/api';
import { IncidentStatusBadge } from '@/components/incidents/IncidentStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const incident = await fetchIncident(id);

  if (!incident) notFound();

  const rawContext = (() => {
    try {
      return JSON.stringify(JSON.parse(incident.rawContext), null, 2);
    } catch {
      return incident.rawContext;
    }
  })();

  return (
    <main className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Link
            href="/incidents"
            className="text-sm text-muted-foreground hover:underline mb-2 block"
          >
            ← Back to incidents
          </Link>
          <h1 className="text-2xl font-semibold">{incident.podName}</h1>
          <p className="text-muted-foreground mt-1">
            {incident.namespace} · {incident.nodeName}
          </p>
        </div>
        <IncidentStatusBadge status={incident.status} />
      </div>

      <div className="grid gap-4">
        {/* Incident info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Incident Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Type</p>
              <p className="font-mono mt-1">{incident.incidentType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Restart Count</p>
              <p className="mt-1">{incident.restartCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Detected At</p>
              <p className="mt-1">{formatDate(incident.detectedAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Confidence Score</p>
              <p className="mt-1">
                {incident.confidenceScore !== null
                  ? `${Math.round(incident.confidenceScore * 100)}%`
                  : '—'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Diagnostic */}
        {incident.detection && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Diagnostic</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Detection</p>
                <p>{incident.detection}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Root Cause</p>
                <p>{incident.rootCause}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Proposed Fix</p>
                <p>{incident.proposedFix}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PR */}
        {incident.prUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pull Request</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{incident.prUrl}</p>
              <Button asChild size="sm">
                <a
                  href={incident.prUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View PR →
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Below threshold notice */}
        {incident.status === 'below_threshold' && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6 text-sm text-yellow-800">
              Confidence score ({Math.round((incident.confidenceScore ?? 0) * 100)}%) 
              is below the threshold — no PR was opened. 
              Review the diagnostic above and apply the fix manually if appropriate.
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {incident.status === 'error' && incident.errorMessage && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6 text-sm text-red-800">
              <p className="font-medium mb-1">Processing error</p>
              <p className="font-mono">{incident.errorMessage}</p>
            </CardContent>
          </Card>
        )}

        {/* Raw context */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Raw Context</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-48">
              {rawContext}
            </pre>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}