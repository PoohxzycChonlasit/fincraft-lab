import Link from "next/link";
import type { ReactNode } from "react";
import type { UserProfile } from "@/lib/auth/session";
import { HeaderThemeToggle } from "@/features/theme/components/header-theme-toggle";
import { ProductNav } from "./product-nav";

export type ProductTab = "home" | "lab" | "workspace" | "login" | "admin-elements";

export type ProductShellProps = {
  children: ReactNode;
  activeTab?: ProductTab;
  user?: UserProfile | null;
  contentMode?: "standard" | "wide";
};

function ProductBrand() {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Link href="/" className="flex min-w-0 items-center gap-2">
        <span className="surface-inset flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-xs font-bold text-[var(--color-craft-accent)]">
          FC
        </span>
        <span className="truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
          FinCraft <span className="text-[var(--color-craft-accent)]">Lab</span>
        </span>
      </Link>
      <span className="hidden border-l border-[var(--border-subtle)] pl-3 text-xs font-medium text-muted-foreground xl:inline-block">
        Financial Literacy Discovery Lab
      </span>
    </div>
  );
}

export function ProductShell({ children, activeTab = "home", user, contentMode = "standard" }: ProductShellProps) {
  const maxWClass = contentMode === "wide" ? "max-w-[1560px]" : "max-w-7xl";

  return (
    <div className="flex min-h-[100dvh] min-w-0 flex-col overflow-hidden bg-[var(--surface-flat)] text-[var(--color-text-primary)]">
      <header className="product-header relative z-50 h-[60px] shrink-0 border-b border-[var(--border-subtle)] bg-[var(--surface-resting)] shadow-xs">
        <div className={`mx-auto flex h-full w-full ${maxWClass} min-w-0 flex-nowrap items-center justify-between gap-2 px-4 sm:px-6`}>
          <ProductBrand />
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ProductNav activeTab={activeTab} user={user} />
            <HeaderThemeToggle />
          </div>
        </div>
      </header>

      <main className={`mx-auto w-full ${maxWClass} min-w-0 flex-1 basis-0 overflow-auto px-4 py-4 sm:px-6 sm:py-6`}>
        {children}
      </main>

      <footer className="shrink-0 border-t border-[var(--border-subtle)] bg-[var(--surface-resting)] py-2.5 text-center text-xs text-muted-foreground">
        <p>Education Only — Simulation Only — Not Financial Advice</p>
      </footer>
    </div>
  );
}
