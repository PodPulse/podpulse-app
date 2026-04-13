import { Badge } from "@/components/ui/badge";
import { getConfidenceMeta } from "@/lib/incident-ui";
import { cn } from "@/lib/utils";

export function ConfidenceIndicator({
  score,
  compact = false,
}: {
  score: number | null;
  compact?: boolean;
}) {
  const meta = getConfidenceMeta(score);

  return (
    <div className={cn("min-w-32 space-y-2", compact && "min-w-28 space-y-1.5")}>
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className={cn("border px-2.5 py-1 font-medium", meta.badgeClassName)}
        >
          {meta.valueLabel}
        </Badge>
      </div>
      <div className={cn("h-2 overflow-hidden rounded-full", meta.trackClassName)}>
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-out",
            meta.barClassName
          )}
          style={{ width: `${meta.percentage ?? 28}%` }}
        />
      </div>
    </div>
  );
}
