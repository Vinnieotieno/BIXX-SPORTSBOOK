import { EventRow } from "./event-row";
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
          <CardHeader>
            <CardTitle>{competition}</CardTitle>
            <span className="odds-figure flex gap-3 text-[11px] font-bold">
              <span className="text-odds-home-ink">1</span>
              <span className="text-odds-draw-ink">X</span>
              <span className="text-odds-away-ink">2</span>
            </span>
          </CardHeader>
          {list.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </Card>
      ))}
    </div>
  );
}
