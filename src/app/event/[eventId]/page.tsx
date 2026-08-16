"use client";

import { use } from "react";
import { LiveBadge, MatchScore } from "@/components/betting/live-badge";
import { MarketList } from "@/components/betting/market-list";
import { Skeleton } from "@/components/ui/skeleton";
import { kickoff } from "@/lib/format";
import { useEvent } from "@/hooks/use-catalogue";

export default function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const { data, isLoading } = useEvent(eventId);

  if (isLoading || !data) {
    return <Skeleton className="h-64 w-full" />;
  }

  const live = data.status === "LIVE";

  return (
    <>
      <header className="mb-3 overflow-hidden rounded-xl bg-panel">
        <div className="flex items-center justify-between bg-header px-4 py-2 text-[11px] font-semibold text-white/80">
          {live ? <LiveBadge minute={data.minute} /> : <span>{kickoff(data.startTime)}</span>}
          <span className="truncate pl-3">{data.competition}</span>
        </div>
        <div className="px-4 py-4">
          <MatchScore event={data} size="hero" />
        </div>
      </header>
      <MarketList event={data} />
    </>
  );
}
