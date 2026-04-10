import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5051';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const res = await fetch(
    `${BACKEND_URL}/auth/invite-info?token=${encodeURIComponent(token)}`,
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
