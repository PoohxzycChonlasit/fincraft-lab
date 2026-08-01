import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import { HeaderThemeToggle } from "@/features/theme/components/header-theme-toggle";
import { FinCraftLogo } from "@/components/brand/fincraft-logo";

export function AuthGatewayFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[var(--page-background)] text-[var(--color-text-primary)]">
      <header className="sticky top-0 z-40 h-[var(--shell-header-height)] border-b border-[var(--border-subtle)] bg-[var(--surface-solid)]">
        <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label="FinCraft Lab home" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2">
            <FinCraftLogo showDescriptor />
          </Link>
          <HeaderThemeToggle />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 sm:py-12 md:grid-cols-[minmax(0,1fr)_minmax(360px,440px)] md:items-start md:gap-12 lg:py-16">
        <div className="order-1 min-w-0 md:order-2">{children}</div>

        <aside className="order-2 space-y-6 md:order-1 md:pt-10">
          <div className="max-w-xl space-y-3">
            <p className="font-label text-[var(--color-craft-accent)]">FinCraft account gateway</p>
            <p className="max-w-lg text-lg font-semibold leading-8 text-foreground sm:text-xl">
              A quiet entry point into the financial learning lab.
            </p>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground">
              Accounts keep your learning worlds available when you return, while the Craft Lab remains open to guests.
            </p>
          </div>

          <section className="surface-paper max-w-xl space-y-4 rounded-2xl p-5 sm:p-6" aria-labelledby="account-benefits-title">
            <div>
              <p id="account-benefits-title" className="text-sm font-bold text-foreground">With an account, you can</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Keep the parts of FinCraft that are personal to you.</p>
            </div>
            <ul className="space-y-3 text-sm text-foreground">
              <BenefitItem>Save and restore Workspaces.</BenefitItem>
              <BenefitItem>Keep learning progress across visits.</BenefitItem>
              <BenefitItem>Use Profile and Financial Companion features.</BenefitItem>
            </ul>
          </section>

          <div className="space-y-2">
            <Link
              href="/lab"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--border-interactive)] bg-[var(--surface-inset)] px-4 py-2.5 text-sm font-bold text-[var(--color-action-primary)] transition-colors hover:bg-[var(--surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
            >
              Explore as Guest <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <p className="text-xs text-muted-foreground">Enter the Craft Lab without creating an account.</p>
          </div>
        </aside>
      </main>

      <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-solid)] px-4 py-4 text-center text-xs font-medium text-muted-foreground">
        Education Only — Simulation Only — Not Financial Advice
      </footer>
    </div>
  );
}

function BenefitItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Check size={16} className="mt-0.5 shrink-0 text-[var(--color-action-primary)]" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}
