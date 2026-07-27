import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProductShell } from "@/components/brand/product-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Log In | FinCraft Lab",
  description: "Log in to access your FinCraft Lab discovery workspace.",
};

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/lab");
  }

  return (
    <ProductShell activeTab="login" user={null}>
      <div className="mx-auto max-w-md py-6 sm:py-12">
        <LoginForm />
      </div>
    </ProductShell>
  );
}
