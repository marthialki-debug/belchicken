import { type ReactNode } from "react";
import { useAuth } from "../lib/auth";

export function AuthGate({ children }: { children: ReactNode }) {
  const { authenticated, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
