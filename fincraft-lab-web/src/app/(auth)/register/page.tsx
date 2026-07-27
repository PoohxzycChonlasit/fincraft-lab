import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Sign Up | FinCraft Lab",
  description: "Create your account to start discovering financial concepts in FinCraft Lab.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
