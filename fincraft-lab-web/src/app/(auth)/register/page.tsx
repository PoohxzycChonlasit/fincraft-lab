import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProductShell } from "@/components/brand/product-shell";
import { RegisterForm } from "@/features/auth/components/register-form";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Sign Up | FinCraft Lab",
  description: "Create your account to start discovering financial concepts in FinCraft Lab.",
};

export default async function RegisterPage() {
  const user = await getSessionUser();

  if (user) {
    redirect("/lab");
  }

  return (
    <ProductShell activeTab="login" user={null}>
      <div className="mx-auto max-w-md py-6 sm:py-12">
        <RegisterForm />
      </div>
    </ProductShell>
  );
}
