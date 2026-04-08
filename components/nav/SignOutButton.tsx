'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

const HIDDEN_ON = ['/', '/login'];

export function SignOutButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (HIDDEN_ON.includes(pathname)) return null;

  const handleSignOut = () => {
    localStorage.removeItem('podpulse_demo_auth');
    router.push('/login');
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-1.5 rounded-full border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-border/70 hover:bg-white/60 hover:text-foreground dark:hover:bg-white/10"
    >
      <LogOut className="size-3.5" />
      Sign out
    </button>
  );
}
