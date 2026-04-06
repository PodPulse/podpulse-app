'use client';

import { useEffect, useEffectEvent } from 'react';

import { normalizeIncident } from '@/lib/api';
import { Incident } from '@/lib/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5051';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? '';

export function useIncidentStream(
  onNewIncident: (incident: Incident) => void
) {
  const handleIncident = useEffectEvent(onNewIncident);

  useEffect(() => {
    let isMounted = true;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let eventSource: EventSource | undefined;

    const connect = () => {
      const url = new URL(`${BACKEND_URL}/api/incidents/stream`);
      url.searchParams.set('apiKey', API_KEY);

      const nextEventSource = new EventSource(url.toString());
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
