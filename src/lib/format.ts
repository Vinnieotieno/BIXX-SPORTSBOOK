const KES = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 2,
});

export const money = (value: number) => KES.format(Number.isFinite(value) ? value : 0);

export const odds = (value: number) => value.toFixed(2);

export const kickoff = (iso: string) =>
  new Intl.DateTimeFormat("en-KE", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));

export const clockLabel = (minute?: number) => (minute == null ? "LIVE" : `${minute}'`);
