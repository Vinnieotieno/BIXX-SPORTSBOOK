"use client";

import { create } from "zustand";
import type { Selection } from "@/lib/api/types";

type BetSlipState = {
  selections: Selection[];
  stake: number;
  toggle: (selection: Selection) => void;
  remove: (outcomeId: string) => void;
  clear: () => void;
  setStake: (stake: number) => void;
};

export const useBetSlip = create<BetSlipState>((set) => ({
  selections: [],
  stake: 100,
  toggle: (selection) =>
    set((state) => {
      const exists = state.selections.some((s) => s.outcomeId === selection.outcomeId);
      if (exists) {
        return {
          selections: state.selections.filter((s) => s.outcomeId !== selection.outcomeId),
        };
      }
      const withoutSameMarket = state.selections.filter(
        (s) => s.marketId !== selection.marketId,
      );
      return { selections: [...withoutSameMarket, selection] };
    }),
  remove: (outcomeId) =>
    set((state) => ({
      selections: state.selections.filter((s) => s.outcomeId !== outcomeId),
    })),
  clear: () => set({ selections: [] }),
  setStake: (stake) => set({ stake: Math.max(0, stake) }),
}));

export const totalOdds = (selections: Selection[]) =>
  selections.reduce((acc, selection) => acc * selection.price, 1);
