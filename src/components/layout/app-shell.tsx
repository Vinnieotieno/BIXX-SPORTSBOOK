import { Suspense } from "react";
import { AppFrame } from "./app-frame";
import { SiteHeader } from "./site-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-base">
      <Suspense>
        <SiteHeader />
      </Suspense>
      <Suspense>
        <AppFrame>{children}</AppFrame>
      </Suspense>
    </div>
  );
}
