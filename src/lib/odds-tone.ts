import type { Outcome } from "@/lib/api/types";

export type OddsTone = "home" | "draw" | "away" | "neutral";

const isDraw = (label: string) => /\bdraw\b|\btie\b|^x$/i.test(label.trim());

export function lineUpOutcomes(outcomes: Outcome[], home: string, away: string): Outcome[] {
  if (outcomes.length < 2 || outcomes.length > 3) return outcomes;

  const draw = outcomes.find((outcome) => isDraw(outcome.label));
  const rest = outcomes.filter((outcome) => outcome !== draw);
  const homeName = home.toLowerCase();
  const awayName = away.toLowerCase();
  const homeOutcome =
    rest.find((outcome) => outcome.label.toLowerCase() === homeName) ??
    rest.find((outcome) => outcome.label.toLowerCase().includes(homeName.split(" ")[0] ?? "")) ??
    rest[0];
  const awayOutcome = rest.find((outcome) => outcome !== homeOutcome) ?? rest[1];

  if (outcomes.length === 2) return [homeOutcome, awayOutcome].filter(Boolean);
  if (draw) return [homeOutcome, draw, awayOutcome].filter(Boolean);
  return outcomes;
}

export function toneForOutcome(label: string, index: number, total: number): OddsTone {
  if (isDraw(label)) return "draw";
  if (total === 3) return index === 0 ? "home" : index === 1 ? "draw" : "away";
  if (total === 2) return index === 0 ? "home" : "away";
  return "neutral";
}

export function shortOddsLabel(tone: OddsTone, label: string, total: number) {
  if (total === 3) {
    if (tone === "home") return "1";
    if (tone === "draw") return "X";
    if (tone === "away") return "2";
  }
  if (total === 2) {
    if (tone === "home") return "1";
    if (tone === "away") return "2";
  }
  return label;
}
