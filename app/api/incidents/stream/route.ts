import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5051';

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('pp_auth')?.value;

  const upstream = await fetch(`${BACKEND_URL}/api/incidents/stream`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
