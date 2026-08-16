"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { depositChapa, getBets, getProfile } from "@/lib/api/endpoints";
import { useIsAuthenticated } from "@/store/auth";

export function useProfile() {
  const authenticated = useIsAuthenticated();
  return useQuery({ queryKey: ["profile"], queryFn: getProfile, enabled: authenticated });
}

export function useBets() {
  const authenticated = useIsAuthenticated();
  return useQuery({ queryKey: ["bets"], queryFn: getBets, enabled: authenticated });
}

export function useDeposit() {
  return useMutation({
    mutationFn: depositChapa,
    onSuccess: (data) => {
      if (data.checkoutUrl) window.location.assign(data.checkoutUrl);
    },
  });
}
