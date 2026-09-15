"use client";

import { use } from "react";
import { EventList } from "@/components/betting/event-list";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/hooks/use-catalogue";

export default function SportPage({ params }: { params: Promise<{ sportId: string }> }) {
  const { sportId } = use(params);
  const { data, isLoading } = useEvents();
  const events = (data ?? []).filter((event) => event.sportId === sportId);

  return (
    <>
      <h1 className="mb-4 text-[22px] font-semibold capitalize tracking-tight">
        {events[0]?.sportName ?? sportId}
      </h1>
      {isLoading ? <Skeleton className="h-64 w-full" /> : <EventList events={events} />}
    </>
  );
}
