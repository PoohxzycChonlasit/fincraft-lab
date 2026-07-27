import Link from "next/link";
import type { ReactNode } from "react";
import type { UserProfile } from "@/lib/auth/session";
import { HeaderThemeToggle } from "@/features/theme/components/header-theme-toggle";
import { LogoutButton } from "./logout-button";

export type ProductShellProps = {
  children: ReactNode;
  activeTab?: "home" | "lab" | "workspace" | "login" | "admin-elements";
  user?: UserProfile | null;
  contentMode?: "standard" | "wide";
};

function ProductBrand() {
  return (
    <div className="flex items-center gap-3">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="surface-inset flex size-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-xs font-bold text-[var(--color-craft-accent)]">
          FC
        </span>
        <span className="text-lg font-bold tracking-tight text-foreground">
          FinCraft <span className="text-[var(--color-craft-accent)]">Lab</span>
        </span>
      </Link>
      <span className="hidden border-l border-[var(--border-subtle)] pl-3 text-xs font-medium text-muted-foreground sm:inline-block">
        Financial Literacy Discovery Lab
      </span>
    </div>
  );
}

function ProductNav({ activeTab, user }: { activeTab: string; user?: UserProfile | null }) {
  const isHome = activeTab === "home";
  const isLab = activeTab === "lab";
  const isWorkspace = activeTab === "workspace";
  const isLogin = activeTab === "login";
  const isAdmin = activeTab === "admin-elements";
  const isAdminAuthorized = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const activeStyle =
    "rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-all style-active-gradient";
  const inactiveStyle =
    "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-[var(--surface-inset)]/50 transition-colors";

  return (
    <nav aria-label="Main Navigation" className="flex flex-wrap items-center gap-1.5 sm:gap-2">
      <Link href="/" aria-current={isHome ? "page" : undefined} className={isHome ? activeStyle : inactiveStyle}>
        Home
      </Link>
      <Link href="/lab" aria-current={isLab ? "page" : undefined} className={isLab ? activeStyle : inactiveStyle}>
        Craft Lab
      </Link>
      {user ? (
        <Link href="/workspace" aria-current={isWorkspace ? "page" : undefined} className={isWorkspace ? activeStyle : inactiveStyle}>
          Workspace
        </Link>
      ) : null}
      {isAdminAuthorized ? (
        <Link href="/admin/elements" aria-current={isAdmin ? "page" : undefined} className={isAdmin ? activeStyle : inactiveStyle}>
          Admin
        </Link>
      ) : null}
      {!user ? (
        <>
          <Link href="/login" aria-current={isLogin ? "page" : undefined} className={isLogin ? activeStyle : inactiveStyle}>
            Log In
          </Link>
          <Link href="/register" className={inactiveStyle}>
            Create Account
          </Link>
        </>
      ) : <LogoutButton />}
    </nav>
  );
}

export function ProductShell({ children, activeTab = "home", user, contentMode = "standard" }: ProductShellProps) {
  const maxWClass = contentMode === "wide" ? "max-w-[1560px]" : "max-w-7xl";

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-flat)] text-[var(--color-text-primary)]">
      <header className="border-b border-[var(--border-subtle)] bg-[var(--surface-resting)] shadow-xs">
        <div className={`mx-auto flex w-full ${maxWClass} flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6`}>
          <ProductBrand />
          <div className="flex items-center gap-3">
            <ProductNav activeTab={activeTab} user={user} />
            <HeaderThemeToggle />
          </div>
        </div>
      </header>

      <main className={`mx-auto w-full ${maxWClass} flex-1 px-4 py-4 sm:px-6 sm:py-6`}>
        {children}
      </main>

      <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-resting)] py-3.5 text-center text-xs text-muted-foreground">
        <p>Education Only · Simulation Only · Not Financial Advice</p>
      </footer>
    </div>
  );
}
