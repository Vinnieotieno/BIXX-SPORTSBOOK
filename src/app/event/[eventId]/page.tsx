"use client";

import { use, useEffect } from "react";
import { LiveBadge, MatchScore } from "@/components/betting/live-badge";
import { MarketList } from "@/components/betting/market-list";
import { Skeleton } from "@/components/ui/skeleton";
import { kickoffDate, kickoffTime } from "@/lib/format";
import { useEvent } from "@/hooks/use-catalogue";

export default function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const { data, isLoading } = useEvent(eventId);

  useEffect(() => {
    if (!data) return;
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, [data]);

  if (isLoading || !data) {
    return <Skeleton className="h-64 w-full" />;
  }

  const live = data.status === "LIVE";

  return (
    <>
      <header className="mb-3 overflow-hidden rounded-xl bg-panel">
        <div className="bg-header px-4 py-2 text-[12px] font-semibold text-white">
          <p className="truncate">
            {data.sportName}, {data.competition}
          </p>
        </div>
        <div className="flex items-start gap-4 px-4 py-4">
          <div className="w-[4.5rem] shrink-0 pt-0.5">
            {live ? (
              <LiveBadge minute={data.minute} />
            ) : (
              <>
                <p className="odds-figure text-[15px] font-bold">{kickoffTime(data.startTime)}</p>
                <p className="mt-0.5 text-[11px] text-dim">{kickoffDate(data.startTime)}</p>
              </>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <MatchScore event={data} size="hero" />
          </div>
        </div>
      </header>
      <MarketList event={data} />
    </>
  );
}
