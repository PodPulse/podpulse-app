import { useEffect, useCallback } from 'react';
import { Incident } from '@/lib/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5051';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? '';

export function useIncidentStream(
  onNewIncident: (incident: Incident) => void
) {
  const connect = useCallback(() => {
    const url = new URL(`${BACKEND_URL}/api/incidents/stream`);
    url.searchParams.set('apiKey', API_KEY);

    const es = new EventSource(url.toString());

    es.onmessage = (event) => {
      try {
        const incident: Incident = JSON.parse(event.data);
        onNewIncident(incident);
      } catch {
        console.error('Failed to parse SSE event', event.data);
      }
    };

    es.onerror = () => {
      es.close();
      // Reconnect after 5 seconds
      setTimeout(connect, 5000);
    };

    return es;
  }, [onNewIncident]);

  useEffect(() => {
    const es = connect();
    return () => es.close();
  }, [connect]);
}