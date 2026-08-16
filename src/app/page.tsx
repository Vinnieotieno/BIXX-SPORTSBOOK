import { Suspense } from "react";
import { LobbyPage } from "@/components/lobby/lobby-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <LobbyPage />
    </Suspense>
  );
}
