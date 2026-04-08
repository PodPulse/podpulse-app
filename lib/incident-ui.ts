import { IncidentStatus, PrStatus } from "@/lib/types";

type StatusMeta = {
  label: string;
  description: string;
  className: string;
  dotClassName: string;
};

type PrMeta = {
  label: string;
  className: string;
};

type ConfidenceMeta = {
  percentage: number | null;
  label: string;
  valueLabel: string;
  badgeClassName: string;
  barClassName: string;
  trackClassName: string;
};

const incidentStatusMeta: Record<IncidentStatus, StatusMeta> = {
  received: {
    label: "Queued",
    description: "Incident captured and awaiting analysis",
    className:
      "border-slate-200/80 bg-slate-100/80 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300 dark:shadow-none",
    dotClassName: "bg-slate-500 dark:bg-slate-400",
  },
  diagnosing: {
    label: "Diagnosing",
    description: "PodPulse AI is tracing the likely root cause",
    className:
      "border-cyan-200/90 bg-cyan-100/80 text-cyan-900 shadow-[0_0_0_1px_rgba(14,165,233,0.08)] dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none",
    dotClassName: "bg-cyan-500 shadow-[0_0_0_6px_rgba(6,182,212,0.16)] animate-pulse",
  },
  pr_opened: {
    label: "PR Opened",
    description: "Remediation proposal shipped to GitHub",
    className:
      "border-blue-200/90 bg-blue-100/85 text-blue-900 shadow-[0_10px_30px_-20px_rgba(37,99,235,0.55)] dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 dark:shadow-none",
    dotClassName: "bg-blue-500 shadow-[0_0_0_6px_rgba(59,130,246,0.15)] dark:shadow-[0_0_0_6px_rgba(59,130,246,0.08)]",
  },
  below_threshold: {
    label: "Low Confidence",
    description: "Signal detected but confidence stayed below rollout threshold",
    className:
      "border-amber-200/90 bg-amber-100/80 text-amber-950 shadow-[0_10px_30px_-22px_rgba(217,119,6,0.45)] dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:shadow-none",
    dotClassName: "bg-amber-500 dark:bg-amber-400",
  },
  error: {
    label: "Attention Needed",
    description: "The pipeline hit an error before remediation completed",
    className:
      "border-rose-200/90 bg-rose-100/85 text-rose-950 shadow-[0_10px_30px_-22px_rgba(225,29,72,0.4)] dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:shadow-none",
    dotClassName: "bg-rose-500 dark:bg-rose-400",
  },
};

const prStatusMeta: Record<PrStatus, PrMeta> = {
  none: {
    label: "No PR",
    className: "border-slate-200/80 bg-slate-100/80 text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300",
  },
  opened: {
    label: "PR Open",
    className:
      "border-blue-200/90 bg-blue-100/85 text-blue-900 shadow-[0_10px_25px_-20px_rgba(37,99,235,0.5)] dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 dark:shadow-none",
  },
  merged: {
    label: "Merged",
    className:
      "border-emerald-200/90 bg-emerald-100/85 text-emerald-900 shadow-[0_10px_25px_-20px_rgba(5,150,105,0.45)] dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:shadow-none",
  },
  closed: {
    label: "Closed",
    className: "border-slate-300/80 bg-slate-200/75 text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300",
  },
};

export function getIncidentStatusMeta(status: IncidentStatus) {
  return incidentStatusMeta[status] ?? incidentStatusMeta.received;
}

export function getPrStatusMeta(status: PrStatus) {
  return prStatusMeta[status] ?? prStatusMeta.none;
}

export function getConfidenceMeta(score: number | null): ConfidenceMeta {
  if (score === null) {
    return {
      percentage: null,
      label: "Pending",
      valueLabel: "Pending",
      badgeClassName: "border-slate-200/80 bg-slate-100/80 text-slate-600 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-400",
      barClassName: "bg-slate-300 dark:bg-slate-600",
      trackClassName: "bg-slate-200/80 dark:bg-slate-700/60",
    };
  }

  const percentage = Math.round(score * 100);

  if (percentage >= 85) {
    return {
      percentage,
      label: "High confidence",
      valueLabel: `${percentage}%`,
      badgeClassName:
        "border-blue-200/90 bg-blue-100/85 text-blue-900 shadow-[0_10px_30px_-22px_rgba(37,99,235,0.45)] dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 dark:shadow-none",
      barClassName: "bg-[linear-gradient(90deg,#2563eb,#38bdf8)]",
      trackClassName: "bg-blue-100/85 dark:bg-blue-500/15",
    };
  }

  if (percentage >= 65) {
    return {
      percentage,
      label: "Moderate confidence",
      valueLabel: `${percentage}%`,
      badgeClassName:
        "border-cyan-200/90 bg-cyan-100/80 text-cyan-950 shadow-[0_10px_30px_-22px_rgba(6,182,212,0.4)] dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none",
      barClassName: "bg-[linear-gradient(90deg,#0891b2,#22d3ee)]",
      trackClassName: "bg-cyan-100/80 dark:bg-cyan-500/15",
    };
  }

  return {
    percentage,
    label: "Below threshold",
    valueLabel: `${percentage}%`,
    badgeClassName:
      "border-amber-200/90 bg-amber-100/80 text-amber-950 shadow-[0_10px_30px_-22px_rgba(217,119,6,0.35)] dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300 dark:shadow-none",
    barClassName: "bg-[linear-gradient(90deg,#d97706,#f59e0b)]",
    trackClassName: "bg-amber-100/80 dark:bg-amber-500/15",
  };
}

export function formatIncidentDate(
  iso: string,
  format: "compact" | "full" = "compact"
) {
  const date = new Date(iso);
  const opts = { timeZone: "UTC" } as const;

  const datePart = new Intl.DateTimeFormat("en-US", {
    ...opts,
    month: format === "full" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-US", {
    ...opts,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${datePart} at ${timePart}`;
}
