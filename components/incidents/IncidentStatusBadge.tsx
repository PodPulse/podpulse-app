import { Badge } from "@/components/ui/badge";
import { getIncidentStatusMeta } from "@/lib/incident-ui";
import { IncidentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function IncidentStatusBadge({
  status,
  compact = false,
}: {
  status: IncidentStatus;
  compact?: boolean;
}) {
  const meta = getIncidentStatusMeta(status);

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-8 gap-2 rounded-full border px-3 text-[11px] font-semibold uppercase tracking-[0.18em]",
        compact && "h-7 px-2.5 text-[10px]",
        meta.className
      )}
      title={meta.description}
    >
      <span className={cn("size-2 rounded-full", meta.dotClassName)} />
      {meta.label}
    </Badge>
  );
}
