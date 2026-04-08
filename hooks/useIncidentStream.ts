'use client';

import { useEffect, useEffectEvent } from 'react';

import { normalizeIncident } from '@/lib/api';
import { Incident } from '@/lib/types';

export function useIncidentStream(
  onNewIncident: (incident: Incident) => void
) {
  const handleIncident = useEffectEvent(onNewIncident);

  useEffect(() => {
    let isMounted = true;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let eventSource: EventSource | undefined;

    const connect = () => {
      const nextEventSource = new EventSource('/api/incidents/stream');
      eventSource = nextEventSource;

      nextEventSource.onmessage = (event) => {
        try {
          const incident: Incident = normalizeIncident(JSON.parse(event.data));
          handleIncident(incident);
        } catch {
          console.error('Failed to parse SSE event', event.data);
        }
      };

      nextEventSource.onerror = () => {
        nextEventSource.close();

        if (isMounted) {
          reconnectTimer = setTimeout(connect, 5000);
        }
      };
    };

    connect();

    return () => {
      isMounted = false;

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      eventSource?.close();
    };
  }, []);
}
