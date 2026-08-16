"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { money } from "@/lib/format";
import { ApiError } from "@/lib/api/client";
import { normalizePhone } from "@/lib/phone";
import { useDeposit, useProfile } from "@/hooks/use-account";

const PRESETS = [100, 500, 1000, 5000];

export default function WalletPage() {
  const [amount, setAmount] = useState(500);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const deposit = useDeposit();
  const { data: profile } = useProfile();

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Deposit</CardTitle>
        <span className="odds-figure text-[12px] text-dim">{money(profile?.balance ?? 0)}</span>
      </CardHeader>
      <div className="space-y-3 p-4">
        <div className="grid grid-cols-4 gap-1.5">
          {PRESETS.map((preset) => (
            <Button key={preset} variant="outline" size="sm" onClick={() => setAmount(preset)}>
              {preset}
            </Button>
          ))}
        </div>
        <Input
          type="number"
          min={10}
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          aria-label="Deposit amount in Kenyan shillings"
        />
        <Input
          placeholder="First name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          aria-label="First name"
        />
        <Input
          placeholder="Last name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          aria-label="Last name"
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-label="Email"
        />
        <Button
          className="w-full"
          disabled={deposit.isPending || amount < 10 || !firstName || !lastName || !email}
          onClick={() =>
            deposit.mutate({
              amount,
              email,
              "first-name": firstName,
              "last-name": lastName,
              phone_number: normalizePhone(profile?.phoneNumber ?? ""),
            })
          }
        >
          {deposit.isPending ? "Opening Chapa" : `Deposit ${money(amount)}`}
        </Button>
        {deposit.isError ? (
          <p className="text-[12px] text-live">
            {deposit.error instanceof ApiError
              ? deposit.error.message
              : "Deposit failed."}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
