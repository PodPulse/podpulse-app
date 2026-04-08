'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (username === 'demo' && password === 'demo') {
      localStorage.setItem('podpulse_demo_auth', 'true');
      router.push('/incidents');
    } else {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(135deg,#0f172a,#0f6fff_60%,#38bdf8)] shadow-[0_18px_40px_-24px_rgba(15,23,42,0.8)]">
              <span className="absolute inset-[5px] rounded-[14px] border border-white/25" />
              <span className="relative size-3 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.8)]" />
            </span>
            <span className="font-heading text-lg font-semibold tracking-[-0.04em] text-slate-950">
              PodPulse
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Sign in to access the incident command center
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Use your demo credentials to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-[14px] border border-border/70 bg-white/72 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400"
                  placeholder="demo"
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-[14px] border border-border/70 bg-white/72 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="rounded-[12px] border border-rose-200/80 bg-rose-50/80 px-3 py-2 text-sm text-rose-700">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Activity className="size-3.5 text-blue-500" />
          Demo environment — not for production use
        </div>
      </div>
    </main>
  );
}
