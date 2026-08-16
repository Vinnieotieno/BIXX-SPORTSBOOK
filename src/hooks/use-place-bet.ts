"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBet } from "@/lib/api/endpoints";
import { totalOdds, useBetSlip } from "@/store/bet-slip";
import { useIsAuthenticated } from "@/store/auth";

export function usePlaceBet() {
  const { selections, stake, clear } = useBetSlip();
  const authenticated = useIsAuthenticated();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      createBet({
        stake,
        is_bonus: 0,
        slips: selections.map((selection) => ({
          event_id: selection.eventId,
          sport_id: selection.sportId,
          team_id: selection.teamId,
          market_id: selection.marketTypeId,
          market_name: selection.marketName,
          participant_name: selection.outcomeLabel,
          odds: selection.price,
          special_bet_value: selection.specialBetValue,
        })),
      }),
    onSuccess: () => {
      clear();
      queryClient.invalidateQueries({ queryKey: ["bets"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    ...mutation,
    authenticated,
    odds: totalOdds(selections),
    payout: totalOdds(selections) * stake,
    canSubmit: authenticated && selections.length > 0 && stake >= 20 && !mutation.isPending,
  };
}
