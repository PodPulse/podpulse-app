import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5051';

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('pp_auth')?.value;

  const res = await fetch(`${BACKEND_URL}/api/agent/status`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
