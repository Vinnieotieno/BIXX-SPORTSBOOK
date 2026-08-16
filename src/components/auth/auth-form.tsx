"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { readStoredPhone, useAuthAction } from "@/hooks/use-auth-form";

const FIELDS = {
  login: [
    { name: "phone_number", label: "Phone number", type: "tel", placeholder: "2547XXXXXXXX" },
    { name: "password", label: "Password", type: "password", placeholder: "" },
  ],
  register: [
    { name: "phone_number", label: "Phone number", type: "tel", placeholder: "2547XXXXXXXX" },
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { name: "password", label: "Password", type: "password", placeholder: "" },
    { name: "confirm_password", label: "Confirm password", type: "password", placeholder: "" },
  ],
  verify: [
    { name: "phone_number", label: "Phone number", type: "tel", placeholder: "2547XXXXXXXX" },
    { name: "verification_code", label: "Verification code", type: "text", placeholder: "6-digit code" },
  ],
};

type AuthFormProps = { action: keyof typeof FIELDS; title: string; submitLabel: string };

export function AuthForm({ action, title, submitLabel }: AuthFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => ({
    phone_number: action === "verify" ? readStoredPhone() : "",
  }));
  const [localError, setLocalError] = useState("");
  const auth = useAuthAction(action);

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
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <form className="space-y-3 p-4" onSubmit={onSubmit}>
        {FIELDS[action].map((field) => (
          <label key={field.name} className="block space-y-1">
            <span className="text-[11px] uppercase tracking-wide text-dim">{field.label}</span>
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
                        : undefined
              }
              maxLength={field.name === "phone_number" ? 12 : field.name === "verification_code" ? 6 : undefined}
              value={values[field.name] ?? ""}
              onChange={(event) =>
                setValues((current) => ({ ...current, [field.name]: event.target.value }))
              }
              required
            />
          </label>
        ))}

        <Button className="w-full" disabled={auth.isPending} type="submit">
          {auth.isPending ? "Please wait" : submitLabel}
        </Button>

        {error ? <p className="text-[12px] text-live">{error}</p> : null}

        {action === "register" && auth.isSuccess ? (
          <p className="text-[12px] text-dim">Code sent. Enter it on the next page.</p>
        ) : null}

        <p className="text-center text-[12px] text-dim">
          {action === "login" ? "New here? " : "Already have an account? "}
          <Link href={action === "login" ? "/register" : "/login"} className="text-gold">
            {action === "login" ? "Create an account" : "Log in"}
          </Link>
        </p>
      </form>
    </Card>
  );
}
