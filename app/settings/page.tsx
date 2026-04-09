'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Key, GitBranch, RefreshCw, Trash2, Copy, Check, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const GITHUB_APP_SLUG = process.env.NEXT_PUBLIC_GITHUB_APP_SLUG ?? '';

interface Settings {
  tenantId: string;
  cluster:  { id: string; name: string };
  apiKey:   { id: string; prefix: string; createdAt: string } | null;
  github:   { connected: boolean; owner: string; repo: string };
  oneTimeKey: string | null;
}

export default function SettingsPage() {
  const router = useRouter();

  const [settings, setSettings]         = useState<Settings | null>(null);
  const [loading, setLoading]           = useState(true);
  const [oneTimeKey, setOneTimeKey]     = useState<string | null>(null);
  const [copied, setCopied]             = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError]   = useState('');
  const [newKey, setNewKey]             = useState<string | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [urlError, setUrlError]         = useState('');

  const fetchSettings = useCallback(async () => {
    const res = await fetch('/api/settings', { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 401) router.push('/login');
      return;
    }
    const data: Settings = await res.json();
    setSettings(data);
    if (data.oneTimeKey) {
      setOneTimeKey(data.oneTimeKey);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchSettings();

    // Surface GitHub error from callback redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'github') {
      setUrlError('GitHub App connection failed. Please try again.');
      window.history.replaceState({}, '', '/settings');
    }
  }, [fetchSettings]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setActionLoading(true);
    setActionError('');
    setNewKey(null);

    const res = await fetch('/api/settings/apikey/regenerate', { method: 'POST' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setActionError(data.error ?? 'Failed to regenerate API key.');
      setActionLoading(false);
      return;
    }

    const { fullKey } = await res.json();
    setNewKey(fullKey);
    await fetchSettings();
    setActionLoading(false);
  };

  const handleRevoke = async () => {
    if (!confirmRevoke) {
      setConfirmRevoke(true);
      return;
    }

    setActionLoading(true);
    setActionError('');

    const res = await fetch('/api/settings/apikey', { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setActionError(data.error ?? 'Failed to revoke API key.');
      setActionLoading(false);
      return;
    }

    setConfirmRevoke(false);
    await fetchSettings();
    setActionLoading(false);
  };

  const githubInstallUrl = GITHUB_APP_SLUG && settings
    ? `https://github.com/apps/${GITHUB_APP_SLUG}/installations/new?state=${settings.tenantId}`
    : '#';

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">

        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your API key and GitHub integration.
          </p>
        </div>

        {/* One-time key banner (shown once after GitHub App install) */}
        {oneTimeKey && (
          <div className="rounded-[14px] border border-emerald-200/80 bg-emerald-50/80 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <p className="mb-2 text-sm font-medium text-emerald-800 dark:text-emerald-300">
              Your API key — save it now, it will not be shown again.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-md bg-white/80 px-3 py-2 text-xs font-mono text-emerald-900 dark:bg-white/10 dark:text-emerald-100">
                {oneTimeKey}
              </code>
              <button
                onClick={() => handleCopy(oneTimeKey)}
                className="shrink-0 rounded-md p-2 text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </button>
            </div>
            <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">
              Use this key in your Helm deployment:
              <br />
              <code className="mt-1 block rounded bg-white/60 px-2 py-1 dark:bg-white/10">
                helm install podpulse-agent podpulse/agent --set apiKey={oneTimeKey}
              </code>
            </p>
          </div>
        )}

        {/* New key banner (shown after regenerate) */}
        {newKey && (
          <div className="rounded-[14px] border border-blue-200/80 bg-blue-50/80 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
            <p className="mb-2 text-sm font-medium text-blue-800 dark:text-blue-300">
              New API key — save it now, it will not be shown again.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-md bg-white/80 px-3 py-2 text-xs font-mono text-blue-900 dark:bg-white/10 dark:text-blue-100">
                {newKey}
              </code>
              <button
                onClick={() => handleCopy(newKey)}
                className="shrink-0 rounded-md p-2 text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-500/20"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </button>
            </div>
          </div>
        )}

        {urlError && (
          <p className="rounded-[12px] border border-rose-200/80 bg-rose-50/80 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {urlError}
          </p>
        )}

        {actionError && (
          <p className="rounded-[12px] border border-rose-200/80 bg-rose-50/80 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
            {actionError}
          </p>
        )}

        {/* API Key card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="size-4" />
              API Key
            </CardTitle>
            <CardDescription>
              Used by the PodPulse agent in your Kubernetes cluster.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings?.apiKey ? (
              <>
                <div className="flex items-center gap-3 rounded-[12px] border border-border/70 bg-muted/40 px-4 py-3">
                  <code className="flex-1 text-sm text-foreground">
                    {settings.apiKey.prefix}<span className="text-muted-foreground">••••••••••••</span>
                  </code>
                  <span className="text-xs text-muted-foreground">
                    {new Date(settings.apiKey.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={actionLoading}
                    className="gap-1.5"
                  >
                    <RefreshCw className="size-3.5" />
                    Regenerate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRevoke}
                    disabled={actionLoading}
                    className={confirmRevoke
                      ? 'gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-500/50 dark:text-rose-400'
                      : 'gap-1.5 text-muted-foreground'
                    }
                  >
                    {confirmRevoke ? (
                      <>
                        <AlertTriangle className="size-3.5" />
                        Confirm revoke
                      </>
                    ) : (
                      <>
                        <Trash2 className="size-3.5" />
                        Revoke
                      </>
                    )}
                  </Button>
                  {confirmRevoke && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmRevoke(false)}
                      disabled={actionLoading}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No active API key. Connect the GitHub App to generate one.
              </p>
            )}
          </CardContent>
        </Card>

        {/* GitHub Integration card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="size-4" />
              GitHub Integration
            </CardTitle>
            <CardDescription>
              Required for automated pull request generation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {settings?.github.connected ? (
              <div className="flex items-center gap-3 rounded-[12px] border border-border/70 bg-muted/40 px-4 py-3">
                <div className="size-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-foreground">
                  Connected to{' '}
                  <strong>
                    {settings.github.owner}{settings.github.repo ? `/${settings.github.repo}` : ''}
                  </strong>
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Install the GitHub App on your organization or repository to enable PR generation.
                </p>
                <Button asChild disabled={!GITHUB_APP_SLUG}>
                  <a href={githubInstallUrl}>
                    <GitBranch className="mr-2 size-4" />
                    Connect GitHub App
                  </a>
                </Button>
                {!GITHUB_APP_SLUG && (
                  <p className="text-xs text-muted-foreground">
                    NEXT_PUBLIC_GITHUB_APP_SLUG is not configured.
                  </p>
                )}
              </div>
            )}
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
