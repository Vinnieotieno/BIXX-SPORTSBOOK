"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { readStoredCode, readStoredPhone, useAuthAction } from "@/hooks/use-auth-form";

const FIELDS = {
  login: [
    { name: "phone_number", label: "Phone number", type: "tel", placeholder: "2547XXXXXXXX" },
    { name: "password", label: "Password", type: "password", placeholder: "Your password" },
  ],
  register: [
    { name: "phone_number", label: "Phone number", type: "tel", placeholder: "2547XXXXXXXX" },
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { name: "password", label: "Password", type: "password", placeholder: "Create a password" },
    { name: "confirm_password", label: "Confirm password", type: "password", placeholder: "Repeat password" },
  ],
  verify: [
    { name: "phone_number", label: "Phone number", type: "tel", placeholder: "2547XXXXXXXX" },
    { name: "verification_code", label: "Verification code", type: "text", placeholder: "6-digit code" },
  ],
};

const COPY = {
  login: {
    kicker: "Welcome back",
    title: "Log in to Bixx",
    text: "Place bets, track slips and manage your wallet.",
  },
  register: {
    kicker: "Join Bixx",
    title: "Create your account",
    text: "One account for live odds, deposits and payouts.",
  },
  verify: {
    kicker: "Almost there",
    title: "Verify your number",
    text: "Enter the code sent to your phone to finish setup.",
  },
};

type AuthFormProps = { action: keyof typeof FIELDS; submitLabel: string };

let verifyAutoStarted = false;

export function AuthForm({ action, submitLabel }: AuthFormProps) {
  const copy = COPY[action];
  const [values, setValues] = useState<Record<string, string>>(() => ({
    phone_number: action === "verify" ? readStoredPhone() : "",
    verification_code: action === "verify" ? readStoredCode() : "",
  }));
  const [localError, setLocalError] = useState("");
  const auth = useAuthAction(action);

  useEffect(() => {
    if (action !== "verify" || verifyAutoStarted) return;
    if (!values.phone_number || !values.verification_code) return;
    verifyAutoStarted = true;
    auth.mutate(values as never);
  }, []);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLocalError("");
    if (action === "register" && values.password !== values.confirm_password) {
      setLocalError("Passwords don't match.");
      return;
    }
    auth.mutate(values as never);
  };

  const error =
    localError ||
    (auth.error instanceof ApiError
      ? auth.error.message
      : auth.isError
        ? action === "login"
          ? "Wrong phone or password."
          : action === "register"
            ? "Could not create the account."
            : "Wrong or expired code."
        : "");

  return (
    <section className="w-full max-w-[420px] rounded-3xl border border-white/10 bg-panel/55 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
      <div className="mb-6 text-center">
        <p className="text-[22px] font-semibold tracking-tight text-gold">bixx</p>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{copy.kicker}</p>
        <h1 className="mt-1 text-[28px] font-semibold tracking-tight">{copy.title}</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-dim">{copy.text}</p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        {FIELDS[action].map((field) => (
          <label key={field.name} className="block space-y-1.5">
            <span className="text-[12px] font-medium text-dim">{field.label}</span>
            <Input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              autoComplete={
                field.name === "confirm_password" || (field.name === "password" && action === "register")
                  ? "new-password"
                  : field.name === "password"
                    ? "current-password"
                    : field.name === "email"
                      ? "email"
                      : field.name === "phone_number"
                        ? "tel"
                        : "one-time-code"
              }
              readOnly={action === "verify" && Boolean(values.verification_code) && !auth.isError}
              maxLength={field.name === "phone_number" ? 12 : field.name === "verification_code" ? 6 : undefined}
              value={values[field.name] ?? ""}
              onChange={(event) =>
                setValues((current) => ({ ...current, [field.name]: event.target.value }))
              }
              className="h-12 rounded-xl border border-line bg-raise/80 px-4"
              required
            />
          </label>
        ))}

        <Button className="h-12 w-full text-[15px]" disabled={auth.isPending} type="submit" size="lg">
          {auth.isPending ? "Please wait" : submitLabel}
        </Button>

        {error ? <p className="text-center text-[13px] text-live">{error}</p> : null}

        {action === "verify" && values.verification_code && !auth.isError ? (
          <p className="text-center text-[13px] text-dim">Code filled from signup. Confirming your account.</p>
        ) : null}

        <p className="pt-1 text-center text-[13px] text-dim">
          {action === "login" ? "New here? " : "Already have an account? "}
          <Link href={action === "login" ? "/register" : "/login"} className="font-semibold text-gold hover:underline">
            {action === "login" ? "Create an account" : "Log in"}
          </Link>
        </p>
      </form>
    </section>
  );
}
