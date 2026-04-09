// Auth is now handled by Next.js middleware (middleware.ts).
// This component is kept as a no-op wrapper for backwards compatibility.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
