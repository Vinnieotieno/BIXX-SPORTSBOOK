import { EventRow } from "./event-row";
import { ODDS_COL } from "./odds-button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { SportEvent } from "@/lib/api/types";

export function EventList({ events }: { events: SportEvent[] }) {
  const groups = events.reduce<Record<string, SportEvent[]>>((acc, event) => {
    acc[event.competition] = [...(acc[event.competition] ?? []), event];
    return acc;
  }, {});

  if (events.length === 0) {
    return (
      <p className="rounded-xl bg-panel px-4 py-8 text-center text-sm text-dim">
        No events for this market.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {Object.entries(groups).map(([competition, list]) => (
        <Card key={competition}>
          <CardHeader className="gap-3 px-3">
            <CardTitle className="min-w-0 flex-1 truncate normal-case tracking-normal">
              {[list[0]?.sportName, competition].filter(Boolean).join(", ")}
            </CardTitle>
            <div className={`${ODDS_COL} grid grid-cols-3 text-center text-[11px] font-bold`}>
              <span className="text-odds-home-ink">1</span>
              <span className="text-odds-draw-ink">X</span>
              <span className="text-odds-away-ink">2</span>
            </div>
          </CardHeader>
          {list.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </Card>
      ))}
    </div>
  );
}
