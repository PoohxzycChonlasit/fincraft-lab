import { ShieldCheck, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserProfile } from "@/lib/auth/session";

type ProfileHeaderProps = {
  user: UserProfile;
  displayName: string;
  avatarPreview: string;
};

function initials(displayName: string): string {
  const letters = displayName.trim().split(/\s+/).map((part) => part[0]).filter(Boolean);
  return letters.slice(0, 2).join("").toUpperCase() || "FC";
}

function StatusPill({ label, value, tone }: { label: string; value: string; tone: "teal" | "green" }) {
  const toneClass = tone === "teal"
    ? "border-[var(--border-subtle)] bg-[var(--surface-solid)] text-foreground"
    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  return (
    <div className={`rounded-xl border px-3 py-2 ${toneClass}`}>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] opacity-70">{label}</dt>
      <dd className="mt-0.5 text-xs font-bold">{value}</dd>
    </div>
  );
}

export function ProfileHeader({ user, displayName, avatarPreview }: ProfileHeaderProps) {
  const visibleName = displayName.trim() || "Unnamed learner";
  return (
    <section aria-label="Account identity summary" className="surface-paper rounded-2xl border border-[var(--border-subtle)] p-4 shadow-xs sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar size="lg" className="h-16 w-16 rounded-2xl after:rounded-2xl">
            <AvatarImage src={avatarPreview || undefined} alt={`${visibleName} avatar`} />
            <AvatarFallback className="rounded-2xl bg-[var(--surface-inset)] text-sm font-bold text-[var(--brand-primary)]">
              {avatarPreview ? <UserRound aria-hidden="true" className="h-7 w-7" /> : initials(visibleName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-orange)]">Identity summary</p>
            <h2 className="mt-1 truncate text-lg font-bold text-foreground">{visibleName}</h2>
            <p className="truncate text-xs text-muted-foreground">Your learning identity across FinCraft Lab.</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-2 sm:min-w-[220px]">
          <StatusPill label="Role" value={user.role} tone="teal" />
          <StatusPill label="Status" value={user.status} tone="green" />
        </dl>
      </div>

      <div className="mt-4 flex items-start gap-2 border-t border-[var(--border-subtle)] pt-4 text-xs text-muted-foreground">
        <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-teal)]" />
        <p><span className="font-semibold text-foreground">Account email:</span> {user.email}</p>
      </div>
    </section>
  );
}
