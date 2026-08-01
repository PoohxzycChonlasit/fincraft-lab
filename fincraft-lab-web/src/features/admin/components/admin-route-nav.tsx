"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FolderTree, FlaskConical } from "lucide-react";

const links = [
  { href: "/admin/elements", label: "Elements", icon: BookOpen },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/recipes", label: "Recipes", icon: FlaskConical },
];

export function AdminRouteNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin content navigation" className="border-b border-[var(--border-subtle)] pb-2">
      <div className="flex min-w-0 flex-wrap items-center gap-1">
        <p className="mr-2 hidden text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-craft-accent)] sm:block">Admin content</p>
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 ${active ? "border-[var(--border-selected)] bg-[var(--surface-inset)] text-foreground shadow-xs" : "border-transparent text-muted-foreground hover:border-[var(--border-subtle)] hover:bg-[var(--surface-inset)] hover:text-foreground"}`}><Icon size={15} aria-hidden="true" />{label}</Link>;
        })}
      </div>
    </nav>
  );
}
