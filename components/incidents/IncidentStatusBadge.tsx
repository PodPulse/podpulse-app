import { Badge } from '@/components/ui/badge';
import { IncidentStatus } from '@/lib/types';

const statusConfig: Record<IncidentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  received:        { label: 'Received',        variant: 'secondary' },
  diagnosing:      { label: 'Diagnosing',      variant: 'outline' },
  pr_opened:       { label: 'PR Opened',       variant: 'default' },
  below_threshold: { label: 'Low Confidence',  variant: 'secondary' },
  error:           { label: 'Error',           variant: 'destructive' },
};

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}