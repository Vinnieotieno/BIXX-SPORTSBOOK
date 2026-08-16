import { AuthForm } from "@/components/auth/auth-form";

export default function VerifyPage() {
  return <AuthForm action="verify" title="Verify account" submitLabel="Verify" />;
}
