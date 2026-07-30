"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UserProfile } from "@/lib/auth/session";
import type { ProductTab } from "./product-shell";
import { LogoutButton } from "./logout-button";

type ProductNavProps = {
  activeTab: ProductTab;
  user?: UserProfile | null;
};

const activeStyle = "inline-flex min-h-11 items-center border-b-2 border-[var(--brand-accent)] px-3 text-xs font-bold text-foreground transition-colors";
const inactiveStyle = "inline-flex min-h-11 items-center border-b-2 border-transparent px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-[var(--border-interactive)] hover:text-foreground";
const accountStyle = "inline-flex min-h-11 items-center rounded-xl bg-[var(--brand-primary)] px-4 text-xs font-bold text-[var(--brand-primary-foreground)] transition-colors hover:bg-[var(--color-action-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2";
const menuLinkStyle = "block rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-[var(--surface-inset)]";

function isAdminUser(user?: UserProfile | null) {
  return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
}

function NavLinks({ activeTab, user, onNavigate, mobile = false }: ProductNavProps & { onNavigate?: () => void; mobile?: boolean }) {
  const classFor = (tab: ProductTab) => mobile ? menuLinkStyle : (activeTab === tab ? activeStyle : inactiveStyle);

  return (
    <>
      <Link href="/" aria-current={activeTab === "home" ? "page" : undefined} className={classFor("home")} onClick={onNavigate}>Home</Link>
      <Link href="/lab" aria-current={activeTab === "lab" ? "page" : undefined} className={classFor("lab")} onClick={onNavigate}>Craft Lab</Link>
      {user ? <Link href="/workspace" aria-current={activeTab === "workspace" ? "page" : undefined} className={classFor("workspace")} onClick={onNavigate}>Workspace</Link> : null}
      {user ? <Link href="/simulations" aria-current={activeTab === "simulations" ? "page" : undefined} className={classFor("simulations")} onClick={onNavigate}>Simulations</Link> : null}
      {user ? <Link href="/settings/pet" aria-current={activeTab === "pet" ? "page" : undefined} className={classFor("pet")} onClick={onNavigate}>Companion</Link> : null}
      {user ? <Link href="/settings/profile" aria-current={activeTab === "profile" ? "page" : undefined} className={classFor("profile")} onClick={onNavigate}>Profile</Link> : null}
      {isAdminUser(user) ? (
        <>
          <Link href="/admin/elements" aria-current={activeTab === "admin-elements" ? "page" : undefined} className={classFor("admin-elements")} onClick={onNavigate}>Elements</Link>
          <Link href="/admin/categories" aria-current={activeTab === "admin-categories" ? "page" : undefined} className={classFor("admin-categories")} onClick={onNavigate}>Categories</Link>
          <Link href="/admin/recipes" aria-current={activeTab === "admin-recipes" ? "page" : undefined} className={classFor("admin-recipes")} onClick={onNavigate}>Recipes</Link>
        </>
      ) : null}
      {!user ? (
        <>
          <Link href="/login" aria-current={activeTab === "login" ? "page" : undefined} className={classFor("login")} onClick={onNavigate}>Sign In</Link>
          <Link href="/register" className={mobile ? menuLinkStyle : accountStyle} onClick={onNavigate}>Create Account</Link>
        </>
      ) : <LogoutButton />}
    </>
  );
}

export function ProductNav({ activeTab, user }: ProductNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback((restoreFocus = true) => {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) closeMenu(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  return (
    <div className="relative">
      <nav aria-label="Main Navigation" className="hidden items-center gap-1.5 lg:flex">
        <NavLinks activeTab={activeTab} user={user} />
      </nav>

      <button
        ref={triggerRef}
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="inline-flex size-11 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] text-foreground transition-colors hover:bg-[var(--surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] lg:hidden"
      >
        {isOpen ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
      </button>

      {isOpen ? (
        <div ref={menuRef} role="menu" aria-label="Navigation menu" className="surface-overlay absolute right-0 top-[calc(100%+8px)] z-50 w-[min(240px,calc(100vw-2rem))] rounded-2xl p-2 shadow-xl lg:hidden">
          <div className="flex flex-col gap-1">
            <NavLinks activeTab={activeTab} user={user} onNavigate={() => closeMenu(false)} mobile />
          </div>
        </div>
      ) : null}
    </div>
  );
}
