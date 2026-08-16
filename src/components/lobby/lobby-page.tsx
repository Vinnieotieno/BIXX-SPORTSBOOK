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
import { cn } from "@/lib/utils";

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
    <div className="space-y-4">
      <div className="sticky top-0 z-20 -mx-3 space-y-3 bg-base px-3 pb-3 pt-3 lg:-mx-4 lg:px-4">
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
            placeholder="Search"
            className="h-12 w-full rounded-full bg-raise pl-11 pr-4 text-sm text-ink placeholder:text-dim"
          />
        </label>
        <SportRail sports={sports} activeId={sportId} onSelect={setSportId} />
      </div>

      <PromoCarousel />

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSportId("all")}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold",
            sportId === "all" ? "bg-ink text-base" : "text-dim hover:text-ink",
          )}
        >
          Popular
        </button>
        {sports.map(([id, sport]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSportId(id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold capitalize",
              sportId === id ? "bg-ink text-base" : "text-dim hover:text-ink",
            )}
          >
            {sport.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <>
          <FeaturedMatches events={filtered} />
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold">{inPlay ? "In-Play" : "All matches"}</h2>
            <Link href="/" className="text-[12px] font-semibold text-dim hover:text-ink">
              View all
            </Link>
          </div>
          <EventList events={filtered} />
        </>
      )}
    </div>
  );
}
