import Link from "next/link";
import type { ReactNode } from "react";
import type { UserProfile } from "@/lib/auth/session";

export type ProductShellProps = {
  children: ReactNode;
  activeTab?: "home" | "lab" | "login" | "admin-elements";
  user?: UserProfile | null;
};

function ProductBrand() {
  return (
    <div className="flex items-center gap-3">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="surface-inset flex size-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-base font-bold text-[var(--color-craft-accent)]">
          🧪
        </span>
        <span className="text-lg font-bold tracking-tight text-foreground">
          FinCraft <span className="text-[var(--color-craft-accent)]">Lab</span>
        </span>
      </Link>
      <span className="hidden sm:inline-block text-xs font-medium text-muted-foreground border-l border-[var(--border-subtle)] pl-3">
        Financial Literacy Discovery Lab
      </span>
    </div>
  );
}

function ProductNav({ activeTab, user }: { activeTab: string; user?: UserProfile | null }) {
  const isHome = activeTab === "home";
  const isLab = activeTab === "lab";
  const isLogin = activeTab === "login";
  const isAdmin = activeTab === "admin-elements";
  const isAdminAuthorized = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const activeStyle =
    "rounded-lg bg-[var(--surface-inset)] px-3 py-1.5 text-xs font-semibold text-foreground border border-[var(--border-subtle)]";
  const inactiveStyle =
    "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-[var(--surface-inset)]/50 transition-colors";

  return (
    <nav aria-label="Main Navigation" className="flex items-center gap-1.5 sm:gap-2">
      <Link href="/" aria-current={isHome ? "page" : undefined} className={isHome ? activeStyle : inactiveStyle}>
        Home
      </Link>
      <Link href="/lab" aria-current={isLab ? "page" : undefined} className={isLab ? activeStyle : inactiveStyle}>
        Craft Lab
      </Link>
      {isAdminAuthorized ? (
        <Link href="/admin/elements" aria-current={isAdmin ? "page" : undefined} className={isAdmin ? activeStyle : inactiveStyle}>
          Admin
        </Link>
      ) : null}
      {!user ? (
        <Link href="/login" aria-current={isLogin ? "page" : undefined} className={isLogin ? activeStyle : inactiveStyle}>
          Log In
        </Link>
      ) : null}
    </nav>
  );
}

export function ProductShell({ children, activeTab = "home", user }: ProductShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-flat)] text-[var(--color-text-primary)]">
      <header className="border-b border-[var(--border-subtle)] bg-[var(--surface-resting)] shadow-xs">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <ProductBrand />
          <ProductNav activeTab={activeTab} user={user} />
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:py-8">
        {children}
      </main>

      <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-resting)] py-4 text-center text-xs text-muted-foreground">
        <p>Education Only • Simulation Only • Not Financial Advice</p>
      </footer>
    </div>
  );
}
