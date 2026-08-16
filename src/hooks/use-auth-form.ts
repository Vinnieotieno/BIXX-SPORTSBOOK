"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login, register, verifyAccount } from "@/lib/api/endpoints";
import { setTokens } from "@/lib/api/token";
import { normalizePhone } from "@/lib/phone";
import type { AuthResult, LoginRequest, RegisterRequest, VerifyRequest } from "@/lib/api/types";

const PHONE_KEY = "bixx.phone";
const CODE_KEY = "bixx.verifyCode";

export function readStoredPhone() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(PHONE_KEY) ?? "";
}

export function readStoredCode() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(CODE_KEY) ?? "";
}

function storeSignup(phone: string, code?: string) {
  sessionStorage.setItem(PHONE_KEY, phone);
  if (code) sessionStorage.setItem(CODE_KEY, String(code));
}

function clearStoredCode() {
  sessionStorage.removeItem(CODE_KEY);
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
      const code = data.verificationCode ?? data.verification_code;
      storeSignup(normalizePhone(variables.phone_number), code);
      if (data?.accessToken) {
        clearStoredCode();
        setTokens(data.accessToken, data.refreshToken);
        router.push("/");
        return;
      }
      if (action === "register") {
        router.push("/verify");
        return;
      }
      if (action === "verify") {
        clearStoredCode();
        router.push("/login");
      }
    },
  });
}
