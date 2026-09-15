"use client";

import { sportIcon } from "@/lib/sport-icon";
import { cn } from "@/lib/utils";

type SportRailProps = {
  sports: [string, { name: string; count: number }][];
  activeId: string;
  onSelect: (id: string) => void;
};

export function SportRail({ sports, activeId, onSelect }: SportRailProps) {
  const items = [{ id: "all", name: "Popular", count: 0 }, ...sports.map(([id, sport]) => ({ id, ...sport }))];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {items.map((item) => {
        const active = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              "inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[13px] font-semibold transition",
              active
                ? "border-accent/40 bg-accent/15 text-accent"
                : "border-line bg-panel text-dim hover:border-ink/20 hover:bg-raise hover:text-ink",
            )}
          >
            <span className={cn("opacity-90", active && "text-accent")}>{sportIcon(item.name, "h-4 w-4")}</span>
            <span className="capitalize">{item.name}</span>
            {item.id !== "all" ? (
              <span className={cn("odds-figure text-[11px]", active ? "text-accent/80" : "text-dim")}>
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
