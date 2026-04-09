'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Settings, User } from 'lucide-react';

const HIDDEN_ON = ['/', '/login', '/register'];

export function ProfileMenu() {
  const pathname   = usePathname();
  const [open, setOpen]   = useState(false);
  const [pos, setPos]     = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef   = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current   && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  if (HIDDEN_ON.includes(pathname)) return null;

  const handleToggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({
        top:   rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((o) => !o);
  };

  const handleSignOut = async () => {
    setOpen(false);
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex size-9 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-colors hover:border-border/70 hover:bg-white/60 hover:text-foreground dark:hover:bg-white/10"
        aria-label="Profile menu"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <User className="size-4" />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{ top: pos.top, right: pos.right }}
          className="fixed z-[100] w-44 origin-top-right rounded-[14px] border border-border/70 bg-background p-1 shadow-lg"
        >
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted/60"
          >
            <Settings className="size-3.5 shrink-0 text-muted-foreground" />
            Settings
          </Link>
          <div className="my-1 h-px bg-border/60" />
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted/60"
          >
            <LogOut className="size-3.5 shrink-0 text-muted-foreground" />
            Sign out
          </button>
        </div>
      )}
    </>
  );
}
