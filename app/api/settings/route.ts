import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5051';

export async function GET() {
  const cookieStore = await cookies();
  const token    = cookieStore.get('pp_auth')?.value;
  const setupKey = cookieStore.get('pp_setup_key')?.value ?? null;

  const res = await fetch(`${BACKEND_URL}/api/settings`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: res.status });
  }

  const data = await res.json();

  // Include the one-time setup key in the response, then clear the cookie.
  const response = NextResponse.json({ ...data, oneTimeKey: setupKey });
  if (setupKey) {
    response.cookies.delete('pp_setup_key');
  }

  return response;
}
