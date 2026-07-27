import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Log In | FinCraft Lab",
  description: "Log in to access your FinCraft Lab discovery workspace.",
};

type LoginPageProps = {
  searchParams: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { registered } = await searchParams;
  const isRegistered = registered === "true";

  return <LoginForm isRegistered={isRegistered} />;
}
