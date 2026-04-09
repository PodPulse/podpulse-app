import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5051';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('pp_auth')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const installationId = req.nextUrl.searchParams.get('installation_id');
  const state          = req.nextUrl.searchParams.get('state');
  const setupAction    = req.nextUrl.searchParams.get('setup_action');

  // GitHub sometimes sends setup_action=install on initial install
  if (setupAction && setupAction !== 'install') {
    return NextResponse.redirect(new URL('/settings', req.url));
  }

  const params = new URLSearchParams();
  if (installationId) params.set('installation_id', installationId);
  if (state)          params.set('state', state);

  const res = await fetch(`${BACKEND_URL}/install/callback?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL('/settings?error=github', req.url));
  }

  const { fullKey } = await res.json();

  const response = NextResponse.redirect(new URL('/settings', req.url));
  if (fullKey) {
    response.cookies.set('pp_setup_key', fullKey, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 5, // 5 minutes, single use
      path:     '/',
    });
  }

  return response;
}
