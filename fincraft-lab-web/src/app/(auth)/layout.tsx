import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AuthGatewayFrame } from "@/features/auth/components/auth-gateway-frame";
import { getSessionUser } from "@/lib/auth/session";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  if (user) {
    redirect("/lab");
  }

  return <AuthGatewayFrame>{children}</AuthGatewayFrame>;
}
