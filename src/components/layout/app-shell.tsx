import { Suspense } from "react";
import { BetSlip } from "@/components/betting/bet-slip";
import { SiteHeader } from "./site-header";
import { SportSidebar } from "./sport-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-base">
      <Suspense>
        <SiteHeader />
      </Suspense>
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[230px_minmax(0,1fr)_300px]">
        <aside className="hidden min-h-0 overflow-y-auto border-r border-line bg-panel lg:block">
          <SportSidebar />
        </aside>
        <main className="min-h-0 min-w-0 overflow-y-auto px-3 pb-3 lg:px-4">
          {children}
          <div className="mt-4 lg:hidden">
            <BetSlip />
          </div>
        </main>
        <aside className="hidden min-h-0 overflow-y-auto border-l border-line bg-panel p-3 lg:block">
          <BetSlip />
        </aside>
      </div>
    </div>
  );
}
