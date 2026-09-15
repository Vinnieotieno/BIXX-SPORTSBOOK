"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EventList } from "@/components/betting/event-list";
import { FeaturedMatches } from "@/components/lobby/featured-matches";
import { PromoCarousel } from "@/components/lobby/promo-row";
import { SportRail } from "@/components/lobby/sport-rail";
import { Skeleton } from "@/components/ui/skeleton";
import { bySport, useEvents } from "@/hooks/use-catalogue";

export function LobbyPage() {
  const params = useSearchParams();
  const inPlay = params.get("view") === "in-play";
  const [query, setQuery] = useState("");
  const [sportId, setSportId] = useState<string>("all");
  const { data, isLoading } = useEvents();

  const sports = Object.entries(bySport(data ?? []));
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (data ?? []).filter((event) => {
      if (inPlay && event.status !== "LIVE") return false;
      if (!inPlay && event.status === "SETTLED") return false;
      if (sportId !== "all" && event.sportId !== sportId) return false;
      if (!needle) return true;
      return `${event.home} ${event.away} ${event.competition} ${event.sportName}`
        .toLowerCase()
        .includes(needle);
    });
  }, [data, inPlay, query, sportId]);

  return (
    <div className="space-y-5">
      <div className="sticky top-0 z-20 -mx-3 space-y-3 bg-base/95 px-3 pb-3 pt-3 backdrop-blur-md lg:-mx-4 lg:px-4">
        <label className="relative block">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dim">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search matches, teams or tournaments"
            className="h-12 w-full rounded-full border border-line bg-panel pl-11 pr-4 text-sm text-ink outline-none placeholder:text-dim focus:border-accent/45"
          />
        </label>
        <SportRail sports={sports} activeId={sportId} onSelect={setSportId} />
      </div>

      <PromoCarousel />

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : (
        <>
          <FeaturedMatches events={filtered} />
          <div className="flex items-end justify-between gap-3 px-0.5">
            <h2 className="text-[22px] font-semibold tracking-tight">{inPlay ? "In-Play" : "All matches"}</h2>
            <Link href="/" className="text-[13px] font-medium text-dim hover:text-ink">
              View all
            </Link>
          </div>
          <EventList events={filtered} />
        </>
      )}
    </div>
  );
}
