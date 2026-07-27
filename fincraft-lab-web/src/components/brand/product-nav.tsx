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

const activeStyle = "rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-all style-active-gradient";
const inactiveStyle = "rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-[var(--surface-inset)]/50 hover:text-foreground";
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
      {isAdminUser(user) ? <Link href="/admin/elements" aria-current={activeTab === "admin-elements" ? "page" : undefined} className={classFor("admin-elements")} onClick={onNavigate}>Admin</Link> : null}
      {!user ? (
        <>
          <Link href="/login" aria-current={activeTab === "login" ? "page" : undefined} className={classFor("login")} onClick={onNavigate}>Sign In</Link>
          <Link href="/register" className={mobile ? menuLinkStyle : inactiveStyle} onClick={onNavigate}>Create Account</Link>
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
      <nav aria-label="Main Navigation" className="hidden items-center gap-1.5 xl:flex">
        <NavLinks activeTab={activeTab} user={user} />
      </nav>

      <button
        ref={triggerRef}
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="inline-flex size-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-inset)] text-foreground transition-colors hover:bg-[var(--surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] xl:hidden"
      >
        {isOpen ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
      </button>

      {isOpen ? (
        <div ref={menuRef} role="menu" aria-label="Navigation menu" className="surface-overlay absolute right-0 top-[calc(100%+8px)] z-50 w-[min(240px,calc(100vw-2rem))] rounded-2xl p-2 shadow-xl xl:hidden">
          <div className="flex flex-col gap-1">
            <NavLinks activeTab={activeTab} user={user} onNavigate={() => closeMenu(false)} mobile />
          </div>
        </div>
      ) : null}
    </div>
  );
}
