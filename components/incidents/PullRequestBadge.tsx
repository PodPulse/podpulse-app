import { GitPullRequestArrow } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getPrStatusMeta } from "@/lib/incident-ui";
import { PrStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PullRequestBadge({ status }: { status: PrStatus }) {
  const meta = getPrStatusMeta(status);

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-8 gap-1.5 rounded-full border px-3 text-[11px] font-semibold uppercase tracking-[0.18em]",
        meta.className
      )}
    >
      <GitPullRequestArrow className="size-3.5" />
      {meta.label}
    </Badge>
  );
}
