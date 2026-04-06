import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Clock3,
  GitPullRequestArrow,
  RotateCcw,
  Server,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

import { ConfidenceIndicator } from '@/components/incidents/ConfidenceIndicator';
import { IncidentStatusBadge } from '@/components/incidents/IncidentStatusBadge';
import { PullRequestBadge } from '@/components/incidents/PullRequestBadge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatIncidentDate } from '@/lib/incident-ui';
import { Incident } from '@/lib/types';

function DiagnosticBlock({
  title,
  body,
  icon: Icon,
}: {
  title: string;
  body: string | null;
  icon: typeof Bot;
}) {
  const renderBody = () => {
    if (!body) {
      return (
        <p className="text-sm leading-7 text-foreground">
          PodPulse is still building this part of the diagnostic.
        </p>
      );
    }

    if (title === 'Proposed fix') {
      const items = body
        .split('\n')
        .map((line) => line.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean);
      return (
        <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground">
          {items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ol>
      );
    }

    return (
      <p className="text-sm leading-7 whitespace-pre-wrap text-foreground">{body}</p>
    );
  };

  return (
    <div className="rounded-[24px] border border-border/70 bg-white/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl border border-blue-200/80 bg-blue-100/75 text-blue-700">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="technical-label">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {title === 'Proposed fix'
              ? 'Suggested remediation generated for operator review.'
              : `PodPulse AI summary for ${title.toLowerCase()}.`}
          </p>
        </div>
      </div>
      {renderBody()}
    </div>
  );
}

export function IncidentDetail({ incident }: { incident: Incident }) {
  const rawContext = (() => {
    try {
      return JSON.stringify(JSON.parse(incident.rawContext), null, 2);
    } catch {
      return incident.rawContext;
    }
  })();

  const prStatus =
    incident.prUrl && incident.prStatus === 'none' ? 'opened' : incident.prStatus;

  const hasDiagnostic =
    incident.detection || incident.rootCause || incident.proposedFix;

  return (
    <main className="flex-1 py-8 sm:py-10">
      <div className="page-shell space-y-6">
        <section className="space-y-4">
          <Link
            href="/incidents"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to incidents
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                {incident.podName}
              </h1>
              <span className="rounded-full border border-slate-200/80 bg-slate-100/75 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                {incident.namespace}
              </span>
              <span className="rounded-full border border-slate-200/80 bg-white/70 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-600">
                {incident.incidentType}
              </span>
              <IncidentStatusBadge status={incident.status} compact />
            </div>
            <ConfidenceIndicator score={incident.confidenceScore} compact />
          </div>

          <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
            <span>namespace: {incident.namespace}</span>
            <span>|</span>
            <span>node: {incident.nodeName}</span>
            <span>|</span>
            <span>{formatIncidentDate(incident.detectedAt)}</span>
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_360px]">
          <div className="space-y-6">
            <Card className="bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,255,0.94))]">
              <CardHeader className="border-b border-border/70 pb-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="space-y-2">
                    <p className="eyebrow">AI diagnostic</p>
                    <CardTitle className="text-2xl">Root cause analysis</CardTitle>
                  </div>
                  <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                    Structured output from PodPulse AI with separate views for
                    detection, likely cause, and the proposed remediation path.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 pt-6">
                {hasDiagnostic ? (
                  <>
                    <DiagnosticBlock
                      title="Detection"
                      body={incident.detection}
                      icon={Sparkles}
                    />
                    <DiagnosticBlock
                      title="Root cause"
                      body={incident.rootCause}
                      icon={BrainCircuit}
                    />
                    <DiagnosticBlock
                      title="Proposed fix"
                      body={incident.proposedFix}
                      icon={Bot}
                    />
                  </>
                ) : (
                  <div className="rounded-[26px] border border-cyan-200/80 bg-cyan-50/80 p-6 text-sm leading-7 text-cyan-950">
                    PodPulse is still assembling this diagnostic. Keep this page
                    open and the incident stream will continue updating.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/86">
              <CardHeader className="border-b border-border/70 pb-5">
                <div className="space-y-2">
                  <p className="eyebrow">Raw context</p>
                  <CardTitle className="text-2xl">Raw incident context (JSON)</CardTitle>
                </div>
                <CardDescription>
                  Raw JSON payload sent by the in-cluster agent.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <pre className="max-h-[420px] overflow-auto rounded-[24px] border border-slate-200/80 bg-slate-950 p-5 font-mono text-xs leading-6 text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  {rawContext}
                </pre>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 xl:sticky xl:top-[106px] xl:self-start">
            <Card className="bg-white/88">
              <CardHeader>
                <div className="mb-2 flex size-11 items-center justify-center rounded-2xl border border-blue-200/80 bg-blue-100/75 text-blue-700">
                  <GitPullRequestArrow className="size-5" />
                </div>
                <CardTitle>Pull request</CardTitle>
                <CardDescription>
                  The GitHub section stays prominent so the diagnostic can move straight into review.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PullRequestBadge status={prStatus} />
                {incident.prUrl ? (
                  <div className="space-y-3">
                    <p className="rounded-[20px] border border-border/70 bg-white/72 p-4 text-sm leading-6 text-muted-foreground">
                      {incident.prUrl}
                    </p>
                    <Button asChild className="w-full">
                      <a href={incident.prUrl} target="_blank" rel="noopener noreferrer">
                        View on GitHub
                        <ArrowUpRight className="size-4" />
                      </a>
                    </Button>
                  </div>
                ) : (
                  <p className="rounded-[20px] border border-border/70 bg-white/72 p-4 text-sm leading-6 text-muted-foreground">
                    No pull request is attached yet. Confidence threshold or pipeline state may still be blocking remediation.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/88">
              <CardHeader>
                <div className="space-y-2">
                  <p className="eyebrow">Signal summary</p>
                  <CardTitle>Fast scan</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[22px] border border-border/70 bg-white/72 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-slate-100/80 text-slate-700">
                      <Clock3 className="size-5" />
                    </div>
                    <div>
                      <p className="technical-label">Detected</p>
                      <p className="mt-1 text-sm text-foreground">
                        {formatIncidentDate(incident.detectedAt, 'full')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[22px] border border-border/70 bg-white/72 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-slate-100/80 text-slate-700">
                      <RotateCcw className="size-5" />
                    </div>
                    <div>
                      <p className="technical-label">Restart count</p>
                      <p className="mt-1 text-sm text-foreground">
                        {incident.restartCount} restarts observed
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[22px] border border-border/70 bg-white/72 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-slate-100/80 text-slate-700">
                      <Server className="size-5" />
                    </div>
                    <div>
                      <p className="technical-label">Node</p>
                      <p className="mt-1 text-sm text-foreground">{incident.nodeName}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {incident.status === 'below_threshold' && (
              <Card className="border-amber-200/90 bg-[linear-gradient(180deg,rgba(255,251,235,0.98),rgba(255,247,237,0.94))]">
                <CardHeader>
                  <div className="mb-2 flex size-11 items-center justify-center rounded-2xl border border-amber-200/80 bg-amber-100/75 text-amber-700">
                    <AlertTriangle className="size-5" />
                  </div>
                  <CardTitle>Confidence below threshold</CardTitle>
                  <CardDescription className="text-amber-900/80">
                    Review the AI recommendation before applying changes manually.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {incident.status === 'error' && incident.errorMessage && (
              <Card className="border-rose-200/90 bg-[linear-gradient(180deg,rgba(255,241,242,0.98),rgba(255,228,230,0.94))]">
                <CardHeader>
                  <div className="mb-2 flex size-11 items-center justify-center rounded-2xl border border-rose-200/80 bg-rose-100/75 text-rose-700">
                    <ShieldAlert className="size-5" />
                  </div>
                  <CardTitle>Pipeline error</CardTitle>
                  <CardDescription className="text-rose-950/80">
                    PodPulse could not complete processing for this incident.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-auto rounded-[20px] border border-rose-200/80 bg-white/70 p-4 font-mono text-xs leading-6 text-rose-950">
                    {incident.errorMessage}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
