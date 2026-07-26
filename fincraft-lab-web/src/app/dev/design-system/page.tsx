import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DesignSystemLab } from "@/features/design-system-lab/components/design-system-lab";

export const metadata: Metadata = {
  title: "Design System Lab | FinCraft Lab",
  description: "Development-only FinCraft visual foundation review.",
};

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <DesignSystemLab />;
}
