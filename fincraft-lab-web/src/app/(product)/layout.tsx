import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { ProductShell } from "@/components/brand/product-shell";
import { getSessionUser } from "@/lib/auth/session";

export default async function ProductLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <ProductShell activeTab="lab" user={user}>
      {children}
    </ProductShell>
  );
}
