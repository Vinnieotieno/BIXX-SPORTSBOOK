import Link from "next/link";
import { OneXTwoGrid } from "@/components/betting/odds-button";
import { extraMarketCount, matchWinnerMarket } from "@/lib/markets";
import { oneXTwoSlots } from "@/lib/odds-tone";
import type { SportEvent } from "@/lib/api/types";

export function FeaturedMatches({ events }: { events: SportEvent[] }) {
  const open = events.filter((event) => matchWinnerMarket(event)?.outcomes.length).slice(0, 6);
  if (open.length === 0) return null;

  const columns = [
    { title: "Goals on tap", items: open.slice(0, 3) },
    { title: "Result", items: open.slice(3, 6) },
  ].filter((column) => column.items.length > 0);

  return (
    <section className="overflow-hidden rounded-2xl bg-panel">
      <header className="flex items-end justify-between px-4 py-3.5">
        <h2 className="text-[22px] font-semibold tracking-tight">Featured Matches</h2>
        <Link href="/" className="text-[13px] font-medium text-dim hover:text-ink">
          View all
        </Link>
      </header>
      <div className="grid bg-line md:grid-cols-[minmax(0,1fr)_240px]">
        <div className="grid gap-px sm:grid-cols-2">
          {columns.map((column) => (
            <div key={column.title} className="bg-panel p-3">
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-dim">{column.title}</h3>
              <ul className="space-y-3">
                {column.items.map((event) => {
                  const market = matchWinnerMarket(event);
                  const slots = oneXTwoSlots(market?.outcomes ?? [], event.home, event.away);
                  const extra = extraMarketCount(event);
                  return (
                    <li key={event.id}>
                      <p className="mb-0.5 truncate text-[11px] text-dim">{event.competition}</p>
                      <Link
                        href={`/event/${event.id}`}
                        className="mb-1.5 block truncate text-[13px] font-semibold hover:text-gold"
                      >
                        {event.home} vs {event.away}
                      </Link>
                      <OneXTwoGrid slots={slots} event={event} market={market} />
                      <Link
                        href={`/event/${event.id}#more-markets`}
                        className="mt-1 inline-flex text-[11px] font-bold text-accent hover:underline"
                      >
                        +{extra}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="relative hidden min-h-[220px] overflow-hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=900&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <p className="relative flex h-full items-end p-4 text-sm font-bold text-white">
            Watch the next kick-off live in-play.
          </p>
        </div>
      </div>
    </section>
  );
}
