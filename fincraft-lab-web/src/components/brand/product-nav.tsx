"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Home, Layers3, LogIn, PawPrint, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import type { UserProfile } from "@/lib/auth/session";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AccountMenu } from "./account-menu";
import type { ProductTab } from "./product-shell";
import { LogoutButton } from "./logout-button";

type ProductNavProps = {
  activeTab: ProductTab;
  user?: UserProfile | null;
};

type NavItem = {
  label: string;
  href: string;
  tab: ProductTab;
  icon: typeof Home;
};

const exploreItems: NavItem[] = [
  { label: "Home", href: "/", tab: "home", icon: Home },
  { label: "Craft Lab", href: "/lab", tab: "lab", icon: Sparkles },
  { label: "Workspace", href: "/workspace", tab: "workspace", icon: Layers3 },
  { label: "Simulations", href: "/simulations", tab: "simulations", icon: Sparkles },
];

const personalItems: NavItem[] = [
  { label: "Companion", href: "/settings/pet", tab: "pet", icon: PawPrint },
  { label: "Profile", href: "/settings/profile", tab: "profile", icon: UserRound },
];

function isAdminUser(user?: UserProfile | null) {
  return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
}

function getExploreItems(user?: UserProfile | null) {
  return user ? exploreItems : exploreItems.filter((item) => item.tab === "home" || item.tab === "lab");
}

function getCurrentLabel(activeTab: ProductTab) {
  if (activeTab === "lab") return "Craft Lab";
  if (activeTab === "workspace") return "Workspace";
  if (activeTab === "simulations") return "Simulations";
  if (activeTab === "pet") return "Companion";
  if (activeTab === "profile") return "Profile";
  if (activeTab === "admin") return "Admin";
  return "Home";
}

function getPathActiveTab(pathname: string): ProductTab | null {
  if (pathname === "/lab" || pathname.startsWith("/lab/")) return "lab";
  if (pathname === "/workspace" || pathname.startsWith("/workspace/")) return "workspace";
  if (pathname === "/simulations" || pathname.startsWith("/simulations/")) return "simulations";
  if (pathname === "/settings/pet") return "pet";
  if (pathname === "/settings/profile") return "profile";
  if (pathname.startsWith("/admin/")) return "admin";
  return pathname === "/" ? "home" : null;
}

function DesktopLink({ item, activeTab }: { item: NavItem; activeTab: ProductTab }) {
  const active = item.tab === activeTab;
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 ${active ? "border-[var(--border-selected)] bg-[var(--surface-inset)] text-foreground shadow-xs" : "border-transparent text-muted-foreground hover:border-[var(--border-subtle)] hover:bg-[var(--surface-inset)] hover:text-foreground"}`}
    >
      <Icon size={14} aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

function DesktopGroup({ label, items, activeTab }: { label: string; items: NavItem[]; activeTab: ProductTab }) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-0.5 border-l border-[var(--border-subtle)] pl-1.5 first:border-l-0 first:pl-0">
      {items.map((item) => <DesktopLink key={item.href} item={item} activeTab={activeTab} />)}
    </div>
  );
}

function MobileLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <SheetClose asChild>
      <Link href={item.href} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-foreground transition-colors hover:bg-[var(--surface-inset)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
        <Icon size={17} aria-hidden="true" />
        <span>{item.label}</span>
      </Link>
    </SheetClose>
  );
}

function MobileGroup({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <section className="space-y-1" aria-labelledby={`mobile-nav-${label.toLowerCase()}`}>
      <h2 id={`mobile-nav-${label.toLowerCase()}`} className="px-3 pt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</h2>
      {items.map((item) => <MobileLink key={item.href} item={item} />)}
    </section>
  );
}

function MobileNavigation({ activeTab, user }: ProductNavProps) {
  const admin = isAdminUser(user);
  const explore = getExploreItems(user);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button type="button" aria-label="Open navigation menu" className="inline-flex size-11 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] text-foreground transition-colors hover:bg-[var(--surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
          <Menu size={18} aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="h-[100dvh] max-h-[100dvh] w-[min(22rem,calc(100vw-1rem))] max-w-none gap-0 overflow-hidden border-l border-[var(--border-subtle)] bg-[var(--surface-solid)] p-0">
        <SheetHeader className="shrink-0 border-b border-[var(--border-subtle)] pr-14">
          <SheetTitle>FinCraft navigation</SheetTitle>
          <SheetDescription>Current route: {getCurrentLabel(activeTab)}</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <MobileGroup label="Explore" items={explore} />
          {user ? <MobileGroup label="Personal" items={personalItems} /> : null}
          {admin ? <MobileGroup label="Admin" items={[{ label: "Admin", href: "/admin/elements", tab: "admin", icon: ShieldCheck }]} /> : null}
          <section className="space-y-1" aria-labelledby="mobile-nav-account">
            <h2 id="mobile-nav-account" className="px-3 pt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Account</h2>
            {user ? <div className="flex items-center gap-3 rounded-xl bg-[var(--surface-inset)] px-3 py-3"><span className="min-w-0"><span className="block truncate text-sm font-bold text-foreground">{user.displayName}</span><span className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{user.role}</span></span></div> : <><SheetClose asChild><Link href="/login" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-foreground hover:bg-[var(--surface-inset)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"><LogIn size={17} aria-hidden="true" />Sign in</Link></SheetClose><SheetClose asChild><Link href="/register" className="flex min-h-11 items-center gap-3 rounded-xl bg-[var(--brand-primary)] px-3 text-sm font-bold text-[var(--brand-primary-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"><UserRound size={17} aria-hidden="true" />Create account</Link></SheetClose></>}
            {user ? <div className="pt-2"><LogoutButton menuItem /></div> : <p className="px-3 pt-2 text-xs leading-5 text-muted-foreground">Explore the Craft Lab as a guest before creating an account.</p>}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ProductNav({ activeTab, user }: ProductNavProps) {
  const pathname = usePathname();
  const resolvedActiveTab = getPathActiveTab(pathname) ?? activeTab;
  const admin = isAdminUser(user);
  const explore = getExploreItems(user);
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="max-w-[7rem] truncate text-xs font-semibold text-muted-foreground xl:hidden">{getCurrentLabel(resolvedActiveTab)}</span>
      <div className="hidden items-center gap-2 xl:flex">
        <nav aria-label="Primary navigation" className="flex items-center gap-1">
          <DesktopGroup label="Explore" items={explore} activeTab={resolvedActiveTab} />
          {user ? <DesktopGroup label="Personal" items={personalItems} activeTab={resolvedActiveTab} /> : null}
          {admin ? <DesktopGroup label="Admin" items={[{ label: "Admin", href: "/admin/elements", tab: "admin", icon: ShieldCheck }]} activeTab={resolvedActiveTab} /> : null}
        </nav>
        {user ? <AccountMenu user={user} activeTab={resolvedActiveTab} /> : <div className="flex items-center gap-1"><Link href="/login" aria-current={resolvedActiveTab === "login" ? "page" : undefined} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-muted-foreground hover:bg-[var(--surface-inset)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">Sign in</Link><Link href="/register" className="inline-flex min-h-11 items-center rounded-xl bg-[var(--brand-primary)] px-3 text-xs font-bold text-[var(--brand-primary-foreground)] hover:bg-[var(--color-action-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">Create account</Link></div>}
      </div>
      <div className="xl:hidden"><MobileNavigation activeTab={resolvedActiveTab} user={user} /></div>
    </div>
  );
}
