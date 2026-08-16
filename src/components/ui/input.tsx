import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md bg-raise px-3 text-sm text-ink",
        "placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-gold",
        className,
      )}
      {...props}
    />
  );
}
