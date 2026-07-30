import { User, Shield } from "lucide-react";
import type { UserProfile } from "@/lib/auth/session";

export function ProfileHeader({
  user,
  avatarPreview,
}: {
  user: UserProfile;
  avatarPreview: string;
}) {
  return (
    <div className="surface-paper flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--border-subtle)] p-5 shadow-xs">
      <div className="flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-solid)] overflow-hidden">
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarPreview}
              alt={`${user.displayName}'s avatar`}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <User className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div>
          <h2 className="font-section-title text-foreground">{user.displayName}</h2>
          <p className="font-caption text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-solid)] px-3 py-1 text-xs font-bold text-foreground border border-[var(--border-subtle)]">
          <Shield className="h-3.5 w-3.5 text-[var(--accent-teal)]" />
          {user.role}
        </span>
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          {user.status}
        </span>
      </div>
    </div>
  );
}
