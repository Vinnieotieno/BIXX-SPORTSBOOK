"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { LiveBadge, MatchScore } from "@/components/betting/live-badge";
import { MarketList } from "@/components/betting/market-list";
import { Skeleton } from "@/components/ui/skeleton";
import { kickoffDate, kickoffTime } from "@/lib/format";
import { sportIcon } from "@/lib/sport-icon";
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
    return <Skeleton className="mt-3 h-72 w-full rounded-2xl" />;
  }

  const live = data.status === "LIVE";

  return (
    <div className="mx-auto max-w-3xl space-y-3 py-3">
      <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-dim hover:text-ink">
        <span aria-hidden>←</span>
        All matches
      </Link>

      <header className="overflow-hidden rounded-2xl bg-panel shadow-sm">
        <div className="flex items-center gap-2 bg-header px-4 py-2.5 text-white">
          <span className="opacity-90">{sportIcon(data.sportName, "h-4 w-4")}</span>
          <p className="min-w-0 truncate text-[13px] font-semibold">
            {data.sportName}, {data.competition}
          </p>
        </div>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-center">
          <div className="sm:border-r sm:border-line sm:pr-4">
            {live ? (
              <LiveBadge minute={data.minute} />
            ) : (
              <>
                <p className="odds-figure text-[22px] font-semibold tracking-tight">{kickoffTime(data.startTime)}</p>
                <p className="mt-1 text-[12px] text-dim">{kickoffDate(data.startTime)}</p>
              </>
            )}
          </div>
          <MatchScore event={data} size="hero" />
        </div>
      </header>

      <MarketList event={data} />
    </div>
  );
}
