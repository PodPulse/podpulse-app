import { NextRequest } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5051';
const API_KEY = process.env.API_KEY ?? '';

export async function GET(_req: NextRequest) {
  const url = new URL(`${BACKEND_URL}/api/incidents/stream`);
  url.searchParams.set('apiKey', API_KEY);

  const upstream = await fetch(url.toString(), {
    headers: { 'x-api-key': API_KEY },
  });

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
