import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/register-form";
import { getSafeReturnTo } from "@/features/auth/utils/auth-utils";

export const metadata: Metadata = {
  title: "Sign Up | FinCraft Lab",
  description: "Create your account to start discovering financial concepts in FinCraft Lab.",
};

type RegisterPageProps = {
  searchParams: Promise<{ returnTo?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { returnTo } = await searchParams;
  return <RegisterForm returnTo={getSafeReturnTo(returnTo)} />;
}
