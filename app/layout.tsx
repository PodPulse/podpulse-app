import type { Metadata } from "next";
import Link from "next/link";
import { Activity } from "lucide-react";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";

import { Badge } from "@/components/ui/badge";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProfileMenu } from "@/components/nav/ProfileMenu";
import { ThemeToggle } from "@/components/nav/ThemeToggle";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from '@vercel/speed-insights/next';

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PodPulse",
    template: "%s | PodPulse",
  },
  description: "Kubernetes incident operator.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        spaceGrotesk.variable
      )}
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>
        <div className="relative isolate min-h-screen overflow-hidden">
          <header className="sticky top-0 z-50 border-b border-border/70 bg-background/78 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="group flex min-w-0 items-center gap-3">
                <span className="shrink-0 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.8)]">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect width="36" height="36" rx="8" fill="#0f172a"/>
                    <path d="M6 12 L12 18 L6 24" stroke="#4f8ef7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <polyline points="15,18 17,18 19,12 22,24 24,15 26,18 30,18" stroke="#e2e8f0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </span>
                <div className="min-w-0">
                  <div className="font-heading text-lg font-semibold tracking-[-0.04em] text-foreground">
                    PodPulse
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    Kubernetes incident operator
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/incidents"
                  className="rounded-full border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-border/70 hover:bg-white/60 hover:text-foreground dark:hover:bg-white/10"
                >
                  Incidents
                </Link>
                <Badge
                  variant="outline"
                  className="hidden h-9 gap-2 border-blue-200/90 bg-blue-100/70 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-900 shadow-[0_10px_24px_-20px_rgba(37,99,235,0.55)] sm:inline-flex dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 dark:shadow-none"
                >
                  <Activity className="size-3.5 text-blue-600" />
                  Live stream
                </Badge>
                <ThemeToggle />
                <ProfileMenu />
              </div>
            </div>
          </header>

          <div className="relative z-10 flex min-h-[calc(100vh-81px)] flex-col">
            {children}
          </div>
        </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
