import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { ProductShell } from "@/components/brand/product-shell";
import { getSessionUser } from "@/lib/auth/session";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  if (user) {
    redirect("/lab");
  }

  return (
    <ProductShell activeTab="login" user={null}>
      <div className="mx-auto max-w-md py-6 sm:py-12">
        {children}
      </div>
    </ProductShell>
  );
}
