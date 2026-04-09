import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5051';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Login failed' }));
    return NextResponse.json(error, { status: res.status });
  }

  const data = await res.json();

  // Store JWT in Next.js httpOnly cookie so server components can forward it.
  const cookieStore = await cookies();
  cookieStore.set('pp_auth', data.token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7, // 7 days
    path:     '/',
  });

  return NextResponse.json({ ok: true });
}
