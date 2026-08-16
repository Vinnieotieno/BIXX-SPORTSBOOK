"use client";

import { sportIcon } from "@/lib/sport-icon";
import { cn } from "@/lib/utils";

type SportRailProps = {
  sports: [string, { name: string; count: number }][];
  activeId: string;
  onSelect: (id: string) => void;
};

export function SportRail({ sports, activeId, onSelect }: SportRailProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      <button type="button" onClick={() => onSelect("all")} className="w-16 shrink-0 text-center">
        <span
          className={cn(
            "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-raise text-ink",
            activeId === "all" && "ring-2 ring-accent",
          )}
        >
          {sportIcon("popular")}
        </span>
        <span className="mt-1 block truncate text-[11px] font-semibold">Popular</span>
      </button>
      {sports.map(([id, sport]) => (
        <button key={id} type="button" onClick={() => onSelect(id)} className="w-16 shrink-0 text-center">
          <span
            className={cn(
              "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-raise text-ink",
              activeId === id && "ring-2 ring-accent",
            )}
          >
            {sportIcon(sport.name)}
          </span>
          <span className="mt-1 block truncate text-[11px] font-semibold capitalize">{sport.name}</span>
        </button>
      ))}
    </div>
  );
}
