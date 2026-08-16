"use client";

import { useQuery } from "@tanstack/react-query";
import { getEvent, getEvents } from "@/lib/api/endpoints";
import type { SportEvent } from "@/lib/api/types";

export const useEvents = () =>
  useQuery({ queryKey: ["events"], queryFn: getEvents, refetchInterval: 30000 });

export const useEvent = (eventId: string) =>
  useQuery({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId),
    refetchInterval: 15000,
  });

export const bySport = (events: SportEvent[]) =>
  events.reduce<Record<string, { name: string; count: number }>>((acc, event) => {
    const entry = acc[event.sportId] ?? { name: event.sportName, count: 0 };
    return { ...acc, [event.sportId]: { name: entry.name, count: entry.count + 1 } };
  }, {});
