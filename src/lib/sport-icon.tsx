import type { ReactNode } from "react";

function Icon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-7 w-7"} fill="none" stroke="currentColor" strokeWidth="1.6">
      {children}
    </svg>
  );
}

export function sportIcon(name: string, className?: string) {
  const key = name.toLowerCase();
  if (key.includes("football") || key.includes("soccer")) {
    return (
      <Icon className={className}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18M3 12h18M7.5 5.5c2 2.5 2 10.5 0 13M16.5 5.5c-2 2.5-2 10.5 0 13" />
      </Icon>
    );
  }
  if (key.includes("basket") || key.includes("nba") || key.includes("wnba")) {
    return (
      <Icon className={className}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3c3 3 3 15 0 18M3 12h18M5 8c5 2 9 2 14 0M5 16c5-2 9-2 14 0" />
      </Icon>
    );
  }
  if (key.includes("tennis")) {
    return (
      <Icon className={className}>
        <circle cx="12" cy="12" r="9" />
        <path d="M4 10c6 1 10 7 8 14M20 14c-6-1-10-7-8-14" />
      </Icon>
    );
  }
  if (key.includes("baseball") || key.includes("mlb")) {
    return (
      <Icon className={className}>
        <circle cx="12" cy="12" r="9" />
        <path d="M7 5c2 4 2 10 0 14M17 5c-2 4-2 10 0 14" />
      </Icon>
    );
  }
  if (key.includes("hockey") || key.includes("nhl")) {
    return (
      <Icon className={className}>
        <path d="M4 16h10l3-6 3 2" />
        <circle cx="8" cy="17" r="2" />
      </Icon>
    );
  }
  if (key.includes("nfl") || key.includes("american")) {
    return (
      <Icon className={className}>
        <ellipse cx="12" cy="12" rx="10" ry="6" />
        <path d="M12 6v12M8 12h8" />
      </Icon>
    );
  }
  if (key.includes("cricket")) {
    return (
      <Icon className={className}>
        <path d="M7 20 17 4M9 4h8M6 18h6" />
      </Icon>
    );
  }
  if (key.includes("mma") || key.includes("ufc")) {
    return (
      <Icon className={className}>
        <path d="M8 14c-2-3 0-7 4-7s6 4 4 7M8 14h8v5H8z" />
      </Icon>
    );
  }
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 12 2 2 4-5" />
    </Icon>
  );
}
