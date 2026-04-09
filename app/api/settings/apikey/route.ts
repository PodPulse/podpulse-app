import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5051';

export async function DELETE() {
  const cookieStore = await cookies();
  const token = cookieStore.get('pp_auth')?.value;

  const res = await fetch(`${BACKEND_URL}/api/settings/apikey`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to revoke API key' }));
    return NextResponse.json(error, { status: res.status });
  }

  return NextResponse.json({ ok: true });
}
