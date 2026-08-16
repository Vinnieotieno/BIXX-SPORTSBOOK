"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login, register, verifyAccount } from "@/lib/api/endpoints";
import { setTokens } from "@/lib/api/token";
import { normalizePhone } from "@/lib/phone";
import type { AuthResult, LoginRequest, RegisterRequest, VerifyRequest } from "@/lib/api/types";

const PHONE_KEY = "bixx.phone";

export function readStoredPhone() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(PHONE_KEY) ?? "";
}

function storePhone(phone: string) {
  sessionStorage.setItem(PHONE_KEY, phone);
}

function withPhone<T extends { phone_number: string }>(body: T): T {
  return { ...body, phone_number: normalizePhone(body.phone_number) };
}

export function useAuthAction(action: "login" | "register" | "verify") {
  const router = useRouter();

  return useMutation({
    mutationFn: (body: LoginRequest | RegisterRequest | VerifyRequest) => {
      if (action === "login") return login(withPhone(body as LoginRequest));
      if (action === "register") return register(withPhone(body as RegisterRequest));
      return verifyAccount(withPhone(body as VerifyRequest));
    },
    onSuccess: (data: AuthResult, variables) => {
      storePhone(normalizePhone(variables.phone_number));
      if (data?.accessToken) {
        setTokens(data.accessToken, data.refreshToken);
        router.push("/");
        return;
      }
      if (action === "register") {
        router.push("/verify");
        return;
      }
      if (action === "verify") {
        router.push("/login");
      }
    },
  });
}
