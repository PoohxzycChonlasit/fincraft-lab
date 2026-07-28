import {
  GLASS_SURFACE_VARIANTS,
  GlassSurface,
  type GlassSurfaceVariant,
} from "@/components/ui/glass-surface";
import { InteractiveGlassSurface } from "@/components/ui/interactive-glass-surface";

const VARIANT_COPY: Record<GlassSurfaceVariant, string> = {
  neutral: "Balanced material for bounded support content.",
  aqua: "Trust-led tint for primary learning actions.",
  amber: "Craft and discovery emphasis without a glow.",
  green: "Resilience and constructive outcome emphasis.",
  violet: "Restrained contrast for combination states.",
};

export function GlassSurfaceBench() {
  return (
    <section
      aria-labelledby="glass-surface-heading"
      className="space-y-5 rounded-2xl border border-[var(--surface-border)] p-5 sm:p-6"
    >
      <header className="max-w-2xl space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-accent)]">
          Bounded Material Primitive
        </p>
        <h2 id="glass-surface-heading" className="text-lg font-bold text-[var(--page-foreground)]">
          GlassSurface variants
        </h2>
        <p className="text-sm leading-relaxed text-[var(--page-muted)]">
          Static specimens stay Server-rendered. Only the focused pointer specimen below hydrates as a Client leaf.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {GLASS_SURFACE_VARIANTS.map((variant) => (
          <GlassSurface
            key={variant}
            as="article"
            variant={variant}
            className="min-h-36 rounded-2xl p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--page-muted)]">
              {variant}
            </p>
            <h3 className="mt-5 text-base font-bold capitalize text-[var(--page-foreground)]">
              {variant} material
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--page-muted)]">
              {VARIANT_COPY[variant]}
            </p>
          </GlassSurface>
        ))}
      </div>

      <InteractiveGlassSurface
        variant="aqua"
        aria-describedby="interactive-glass-note"
        className="w-full rounded-2xl p-5 text-left"
      >
        <span className="block text-sm font-bold text-[var(--page-foreground)]">
          Interactive pointer specimen
        </span>
        <span id="interactive-glass-note" className="mt-1 block text-xs leading-relaxed text-[var(--page-muted)]">
          Keyboard-focusable button; pointer highlight is decorative and disabled for touch or reduced motion.
        </span>
      </InteractiveGlassSurface>
    </section>
  );
}
