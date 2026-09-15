"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { bySport, useEvents } from "@/hooks/use-catalogue";
import { kickoffTime } from "@/lib/format";
import { sportIcon } from "@/lib/sport-icon";
import type { SportEvent } from "@/lib/api/types";

function SectionLabel({ children }: { children: string }) {
  return (
    <h2 className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
      {children}
    </h2>
  );
}

function TrendingMatch({ event }: { event: SportEvent }) {
  const live = event.status === "LIVE";

  return (
    <Link
      href={`/event/${event.id}`}
      className="group mx-2 flex items-start gap-3 rounded-xl px-2 py-2.5 transition hover:bg-raise"
    >
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-raise text-ink transition group-hover:bg-line">
        {sportIcon(event.sportName, "h-4 w-4")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          {live ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-live">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" />
              Live
            </span>
          ) : (
            <span className="odds-figure text-[11px] font-semibold text-dim">{kickoffTime(event.startTime)}</span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-[13px] font-semibold leading-snug">{event.home}</span>
        <span className="block truncate text-[13px] font-semibold leading-snug">{event.away}</span>
        <span className="mt-0.5 block truncate text-[11px] text-dim">{event.competition}</span>
      </span>
    </Link>
  );
}

export function SportSidebar() {
  const { data, isLoading } = useEvents();
  const events = data ?? [];
  const sports = Object.entries(bySport(events)).sort((a, b) => a[1].name.localeCompare(b[1].name));
  const trending = [...events]
    .filter((event) => event.status !== "SETTLED")
    .sort((a, b) => Number(a.status === "LIVE" ? 0 : 1) - Number(b.status === "LIVE" ? 0 : 1))
    .slice(0, 6);

  return (
    <div className="py-4">
      <section>
        <SectionLabel>Trending</SectionLabel>
        <div className="space-y-0.5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="mx-3 mb-2 h-16 rounded-xl" />
              ))
            : trending.map((event) => <TrendingMatch key={event.id} event={event} />)}
        </div>
      </section>

      <div className="mx-4 my-4 h-px bg-line" />

      <section>
        <SectionLabel>Sports</SectionLabel>
        <div className="space-y-0.5">
          {sports.map(([sportId, sport]) => (
            <Link
              key={sportId}
              href={`/sports/${sportId}`}
              className="mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-raise"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-raise">
                {sportIcon(sport.name, "h-4 w-4")}
              </span>
              <span className="min-w-0 flex-1 truncate text-[14px] font-semibold capitalize">{sport.name}</span>
              <span className="odds-figure rounded-full bg-raise px-2 py-0.5 text-[11px] font-semibold text-dim">
                {sport.count}
              </span>
            </Link>
          ))}
          {!isLoading && sports.length === 0 ? (
            <p className="px-4 py-3 text-[13px] text-dim">No events yet.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
