'use client';

import { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AgentStatus = 'online' | 'degraded' | 'offline';

interface AgentStatusPayload {
  status: AgentStatus;
  lastSeenAt: string | null;
  secondsSinceLastSeen: number | null;
}

interface DisplayState {
  backendReachable: boolean;
  agent: AgentStatusPayload | null;
}

function formatElapsed(seconds: number): string {
  if (seconds < 20)  return 'Just now';
  if (seconds < 60)  return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)  return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

const statusMeta: Record<AgentStatus, { label: string; dot: string; text: string }> = {
  online:   { label: 'Online',   dot: 'bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.18)] animate-pulse', text: 'text-emerald-700 dark:text-emerald-400' },
  degraded: { label: 'Degraded', dot: 'bg-amber-500  shadow-[0_0_0_5px_rgba(245,158,11,0.18)]',               text: 'text-amber-700  dark:text-amber-400'   },
  offline:  { label: 'Offline',  dot: 'bg-rose-500   shadow-[0_0_0_5px_rgba(244,63,94,0.18)]',                text: 'text-rose-700   dark:text-rose-400'    },
};

export function AgentStatusCard() {
  const [state, setState] = useState<DisplayState>({ backendReachable: true, agent: null });

  const poll = async () => {
    try {
      const res = await fetch('/api/proxy/agent/status');
      if (!res.ok) {
        setState({ backendReachable: false, agent: null });
        return;
      }
      const data: AgentStatusPayload = await res.json();
      setState({ backendReachable: true, agent: data });
    } catch {
      setState({ backendReachable: false, agent: null });
    }
  };

  useEffect(() => {
    poll();
    const id = setInterval(poll, 20_000);
    return () => clearInterval(id);
  }, []);

  const agentStatus: AgentStatus = !state.backendReachable
    ? 'offline'
    : (state.agent?.status ?? 'offline');

  const meta = statusMeta[agentStatus];

  return (
    <Card size="sm">
      <CardHeader>
        <div className="mb-2 flex size-11 items-center justify-center rounded-2xl icon-blue">
          <Radio className="size-5" />
        </div>
        <p className="technical-label">Agent liveness</p>
        <CardTitle className="text-3xl">
          <span className={meta.text}>{meta.label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full shrink-0 ${meta.dot}`} />
          <span className="text-sm text-muted-foreground">In-cluster agent</span>
        </div>

        <div className="surface-raised rounded-[16px] border border-border/70 px-3 py-2 space-y-1.5">
          <Row
            label="Backend"
            value={state.backendReachable ? 'Reachable' : 'Unreachable'}
            ok={state.backendReachable}
          />
          <Row
            label="Last ping"
            value={
              state.agent?.secondsSinceLastSeen != null
                ? formatElapsed(state.agent.secondsSinceLastSeen)
                : '—'
            }
            ok={agentStatus === 'online'}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={ok ? 'text-foreground font-medium' : 'text-rose-600 dark:text-rose-400 font-medium'}>
        {value}
      </span>
    </div>
  );
}
