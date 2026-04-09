'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Activity } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('No invite token found. Please use the link from your invitation email.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, inviteToken: token }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const messages: string[] =
          data.errors ?? (data.error ? [data.error] : ['Registration failed. Please try again.']);
        setError(messages.join(' '));
        return;
      }

      window.location.href = '/incidents';
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-3">
            <span className="shrink-0 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.8)]">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="36" height="36" rx="8" fill="#0f172a"/>
                <path d="M6 12 L12 18 L6 24" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <polyline points="15,18 17,18 19,12 22,24 24,15 26,18 30,18" stroke="#e2e8f0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </span>
            <span className="font-heading text-lg font-semibold tracking-[-0.04em] text-foreground">
              PodPulse
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Create your account to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>
              You were invited to join PodPulse. Choose a password to finish setting up your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!token && (
              <p className="mb-4 rounded-[12px] border border-amber-200/80 bg-amber-50/80 px-3 py-2 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                Missing invite token. Please use the link from your invitation email.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-[14px] border border-border/70 bg-white/72 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 dark:bg-white/[0.06]"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="flex h-10 w-full rounded-[14px] border border-border/70 bg-white/72 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 dark:bg-white/[0.06]"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm"
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-[14px] border border-border/70 bg-white/72 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 dark:bg-white/[0.06]"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="rounded-[12px] border border-rose-200/80 bg-rose-50/80 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading || !token}>
                {loading ? 'Creating account…' : 'Create account'}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-500 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Activity className="size-3.5 text-blue-500" />
          PodPulse — Kubernetes incident diagnostics
        </div>
      </div>
    </main>
  );
}
