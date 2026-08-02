"use client";

import Link from "next/link";
import { Layers3, PawPrint, Settings2, ShieldCheck, ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserProfile } from "@/lib/auth/session";
import type { ProductTab } from "./product-shell";
import { LogoutButton } from "./logout-button";

function isAdminUser(user: UserProfile) {
  return user.role === "ADMIN" || user.role === "SUPER_ADMIN";
}

function getInitials(displayName: string) {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "FC";
}

function AccountLink({ href, label, active, children }: { href: string; label: string; active?: boolean; children: ReactNode }) {
  return (
    <DropdownMenuItem asChild>
      <Link href={href} className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold outline-none transition-colors ${active ? "bg-[var(--surface-inset)] text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
        {children}
        <span>{label}</span>
      </Link>
    </DropdownMenuItem>
  );
}

export function AccountMenu({ user, activeTab }: { user: UserProfile; activeTab: ProductTab }) {
  const [open, setOpen] = useState(false);
  const admin = isAdminUser(user);
  const activeAccount = activeTab === "profile" || activeTab === "pet";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          id="account-menu-trigger"
          data-account-trigger="true"
          type="button"
          aria-label={`Open account menu for ${user.displayName}`}
          title={user.displayName}
          aria-controls="account-menu"
          aria-expanded={open}
          className={`inline-flex min-h-11 max-w-[min(15rem,calc(100vw-7rem))] items-center gap-2 rounded-xl border px-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 ${activeAccount || open ? "border-[var(--border-selected)] bg-[var(--surface-inset)]" : "border-[var(--border-subtle)] bg-[var(--surface-solid)] hover:bg-[var(--surface-inset)]"}`}
        >
          <Avatar size="sm" className="shrink-0 bg-[var(--surface-paper)] font-bold text-[var(--color-action-primary)]">
            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
          <span className="hidden min-w-0 flex-1 xl:block">
            <span className="block truncate text-xs font-bold text-foreground">{user.displayName}</span>
            <span className="block truncate text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-secondary)]">{user.role}</span>
          </span>
          <ChevronDown size={15} aria-hidden="true" className={`shrink-0 text-[var(--color-text-secondary)] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent id="account-menu" align="end" className="w-72 max-w-[calc(100vw-1rem)] rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-solid)] p-2 shadow-[var(--shadow-overlay)]">
        <DropdownMenuLabel className="px-3 py-2">
          <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Account</span>
          <span className="mt-1 block truncate text-sm font-bold text-foreground">{user.displayName}</span>
          <span className="mt-1 inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-action-primary)]">{user.role}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <AccountLink href="/settings/profile" label="Profile settings" active={activeTab === "profile"}><Settings2 size={16} aria-hidden="true" /></AccountLink>
        <AccountLink href="/settings/pet" label="Financial Companion" active={activeTab === "pet"}><PawPrint size={16} aria-hidden="true" /></AccountLink>
        <AccountLink href="/workspace" label="Workspace" active={activeTab === "workspace"}><Layers3 size={16} aria-hidden="true" /></AccountLink>
        {admin ? <AccountLink href="/admin/elements" label="Admin" active={activeTab === "admin"}><ShieldCheck size={16} aria-hidden="true" /></AccountLink> : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutButton menuItem />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
