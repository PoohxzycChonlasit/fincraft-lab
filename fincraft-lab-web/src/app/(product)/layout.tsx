import type { ReactNode } from "react";
import { ProductShell } from "@/components/brand/product-shell";
import { getSessionUser } from "@/lib/auth/session";

export default async function ProductLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  return (
    <ProductShell activeTab="lab" user={user} contentMode="wide" layoutMode="workspace">
      {children}
    </ProductShell>
  );
}
