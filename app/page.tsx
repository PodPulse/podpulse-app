import {
  Activity,
  Bot,
  GitPullRequestArrow,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IncidentsCTA } from "@/components/home/IncidentsCTA";
import { fetchIncidents } from "@/lib/api";
import { Incident } from "@/lib/types";

const workflow = [
  {
    title: "Detect",
    description: "Stream Kubernetes incidents as they happen and cluster them into a single triage queue.",
    icon: Activity,
  },
  {
    title: "Diagnose",
    description: "AI analysis isolates root cause, confidence, and the exact remediation path for platform teams.",
    icon: Bot,
  },
  {
    title: "Remediate",
    description: "Open GitHub pull requests with proposed fixes so operators can merge rather than rewrite.",
    icon: GitPullRequestArrow,
  },
];

function computeStats(incidents: Incident[]) {
  const scored = incidents.filter((i) => i.confidenceScore !== null);
  const signalQuality =
    scored.length === 0
      ? "—"
      : `${Math.round(
          (scored.reduce((sum, i) => sum + (i.confidenceScore ?? 0), 0) /
            scored.length) *
            100
        )}%`;

  const githubPRs = incidents.filter(
    (i) => i.prUrl || i.prStatus === "opened"
  ).length;

  const namespaceCount = new Set(incidents.map((i) => i.namespace)).size;

  return { signalQuality, githubPRs, namespaceCount };
}

export default async function Home() {
  let incidents: Incident[] = [];
  try {
    incidents = await fetchIncidents();
  } catch {
    // stat strip shows fallback values
  }

  const { signalQuality, githubPRs, namespaceCount } = computeStats(incidents);

  return (
    <main className="flex-1 py-10 sm:py-14">
      <div className="page-shell space-y-8">
        <section className="pt-16 pb-12">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            PodPulse
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
            Premium incident diagnostics for Kubernetes operators.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Turn cluster failures into a live, trustworthy remediation workflow
            — from signal to pull request.
          </p>
          <div className="mt-6">
            <IncidentsCTA />
          </div>
          <hr className="mt-10 mb-6 border-border/70" />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-baseline gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Signal quality
              </span>
              <span className="text-sm font-semibold text-foreground">
                {signalQuality}
              </span>
            </span>
            <span className="text-muted-foreground/40">|</span>
            <span className="flex items-baseline gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                GitHub
              </span>
              <span className="text-sm font-semibold text-foreground">
                {githubPRs} PRs
              </span>
            </span>
            <span className="text-muted-foreground/40">|</span>
            <span className="flex items-baseline gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Coverage
              </span>
              <span className="text-sm font-semibold text-foreground">
                {namespaceCount} ns
              </span>
            </span>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {workflow.map(({ title, description, icon: Icon }) => (
            <Card key={title}>
              <CardHeader>
                <div className="mb-2 flex size-11 items-center justify-center rounded-2xl icon-blue">
                  <Icon className="size-5" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <CardHeader>
              <Badge
                variant="outline"
                className="mb-2 h-8 w-fit border-blue-200/90 bg-blue-100/75 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"
              >
                Kubernetes-native
              </Badge>
              <CardTitle className="text-2xl">
                Serious infrastructure UX without generic SaaS noise.
              </CardTitle>
              <CardDescription>
                The redesigned surface uses a tighter visual system, calmer
                hierarchy, and more expressive incident states so operators can
                scan faster without losing trust.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-gradient-blue">
            <CardHeader>
              <div className="mb-2 flex size-11 items-center justify-center rounded-2xl border border-emerald-200/80 bg-emerald-100/70 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                <ShieldCheck className="size-5" />
              </div>
              <CardTitle>Trustworthy by design</CardTitle>
              <CardDescription>
                Strong contrast, restrained motion, and technical typography keep the product credible in production contexts.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>
      </div>
    </main>
  );
}
