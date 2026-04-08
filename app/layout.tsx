import type { Metadata } from "next";
import Link from "next/link";
import { Activity } from "lucide-react";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";

import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/components/nav/SignOutButton";
import { cn } from "@/lib/utils";

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
  description: "AI control plane for Kubernetes incident diagnostics and remediation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        spaceGrotesk.variable
      )}
    >
      <body className="min-h-full bg-background text-foreground">
        <div className="relative isolate min-h-screen overflow-hidden">
          <header className="sticky top-0 z-50 border-b border-border/70 bg-background/78 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="group flex min-w-0 items-center gap-3">
                <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(135deg,#0f172a,#0f6fff_60%,#38bdf8)] shadow-[0_18px_40px_-24px_rgba(15,23,42,0.8)]">
                  <span className="absolute inset-[5px] rounded-[14px] border border-white/25" />
                  <span className="relative size-3 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.8)]" />
                </span>
                <div className="min-w-0">
                  <div className="font-heading text-lg font-semibold tracking-[-0.04em] text-slate-950">
                    PodPulse
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    AI control plane for Kubernetes incidents
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/incidents"
                  className="rounded-full border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-border/70 hover:bg-white/60 hover:text-foreground"
                >
                  Incidents
                </Link>
                <Badge
                  variant="outline"
                  className="hidden h-9 gap-2 border-blue-200/90 bg-blue-100/70 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-900 shadow-[0_10px_24px_-20px_rgba(37,99,235,0.55)] sm:inline-flex"
                >
                  <Activity className="size-3.5 text-blue-600" />
                  Live stream
                </Badge>
                <SignOutButton />
              </div>
            </div>
          </header>

          <div className="relative z-10 flex min-h-[calc(100vh-81px)] flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
