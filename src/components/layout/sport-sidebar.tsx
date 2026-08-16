"use client";

import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { bySport, useEvents } from "@/hooks/use-catalogue";
import { sportIcon } from "@/lib/sport-icon";

export function SportSidebar() {
  const { data, isLoading } = useEvents();
  const events = data ?? [];
  const sports = Object.entries(bySport(events)).sort((a, b) => a[1].name.localeCompare(b[1].name));
  const trending = [...events]
    .filter((event) => event.status !== "SETTLED")
    .sort((a, b) => Number(a.status === "LIVE" ? 0 : 1) - Number(b.status === "LIVE" ? 0 : 1))
    .slice(0, 6);

  return (
    <div className="space-y-5 py-2">
      <section>
        <h2 className="px-3 pb-2 text-[12px] font-bold uppercase tracking-wide text-accent">Trending</h2>
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="mb-1 h-9 w-full" />)
          : trending.map((event) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-ink hover:bg-raise"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-raise text-ink">
                  {sportIcon(event.sportName, "h-4 w-4")}
                </span>
                <span className="min-w-0 truncate">
                  {event.status === "LIVE" ? "Live: " : ""}
                  {event.home} vs {event.away}
                </span>
              </Link>
            ))}
      </section>

      <section>
        <h2 className="px-3 pb-2 text-[12px] font-bold uppercase tracking-wide text-accent">A-Z</h2>
        <Link href="/" className="flex items-center justify-between px-3 py-2 text-[13px] text-ink hover:bg-raise">
          Next to Start
        </Link>
        {sports.map(([sportId, sport]) => (
          <Link
            key={sportId}
            href={`/sports/${sportId}`}
            className="flex items-center justify-between px-3 py-2 text-[13px] text-ink hover:bg-raise"
          >
            <span className="flex items-center gap-2">
              <span className="opacity-80">{sportIcon(sport.name, "h-4 w-4")}</span>
              <span className="capitalize">{sport.name}</span>
            </span>
            <span className="odds-figure text-[11px] text-dim">{sport.count}</span>
          </Link>
        ))}
        {!isLoading && sports.length === 0 ? (
          <p className="px-3 py-3 text-[12px] text-dim">No events yet.</p>
        ) : null}
      </section>
    </div>
  );
}
