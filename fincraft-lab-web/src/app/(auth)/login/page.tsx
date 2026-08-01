import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";
import { getSafeReturnTo } from "@/features/auth/utils/auth-utils";

export const metadata: Metadata = {
  title: "Log In | FinCraft Lab",
  description: "Log in to access your FinCraft Lab discovery workspace.",
};

type LoginPageProps = {
  searchParams: Promise<{ registered?: string; returnTo?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered, returnTo } = await searchParams;
  const isRegistered = registered === "true";
  const safeReturnTo = getSafeReturnTo(returnTo);

  return <LoginForm isRegistered={isRegistered} returnTo={safeReturnTo} />;
}
