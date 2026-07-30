import Link from "next/link";
import type { ReactNode } from "react";
import type { UserProfile } from "@/lib/auth/session";
import { HeaderThemeToggle } from "@/features/theme/components/header-theme-toggle";
import { FinCraftLogo } from "./fincraft-logo";
import { ProductNav } from "./product-nav";

export type ProductTab = "home" | "lab" | "workspace" | "simulations" | "profile" | "pet" | "login" | "admin-elements" | "admin-categories";

export type ProductShellProps = {
  children: ReactNode;
  activeTab?: ProductTab;
  user?: UserProfile | null;
  contentMode?: "standard" | "wide";
  layoutMode?: "document" | "workspace";
};

function ProductBrand() {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Link
        href="/"
        aria-label="FinCraft Lab home"
        className="-m-1 min-w-0 rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        <FinCraftLogo />
      </Link>
      <span className="hidden text-[10px] font-medium text-muted-foreground xl:inline-block">
        Financial Literacy Discovery Lab
      </span>
    </div>
  );
}

export function ProductShell({ children, activeTab = "home", user, contentMode = "standard", layoutMode = "document" }: ProductShellProps) {
  const maxWClass = contentMode === "wide" ? "max-w-[1560px]" : "max-w-7xl";
  const isWorkspace = layoutMode === "workspace";

  return (
    <div className={`flex min-w-0 flex-col bg-[var(--surface-flat)] text-[var(--color-text-primary)] ${isWorkspace ? "h-[100dvh] overflow-hidden" : "min-h-[100dvh]"}`}>
      <header className="product-header relative z-50 h-[58px] shrink-0 border-b border-[var(--border-subtle)] bg-[var(--surface-resting)]">
        <div className={`mx-auto flex h-full w-full ${maxWClass} min-w-0 flex-nowrap items-center justify-between gap-2 px-4 sm:px-6`}>
          <ProductBrand />
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ProductNav activeTab={activeTab} user={user} />
            <HeaderThemeToggle />
          </div>
        </div>
      </header>

      <main className={`mx-auto w-full ${maxWClass} min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-6 ${isWorkspace ? "min-h-0 overflow-hidden" : ""}`}>
        {children}
      </main>

      <footer className="shrink-0 border-t border-[var(--border-subtle)] bg-[var(--surface-resting)] py-2 text-center text-xs text-muted-foreground">
        <p>Education Only — Simulation Only — Not Financial Advice</p>
      </footer>
    </div>
  );
}
