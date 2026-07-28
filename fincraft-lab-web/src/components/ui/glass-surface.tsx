import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const GLASS_SURFACE_VARIANTS = [
  "neutral",
  "aqua",
  "amber",
  "green",
  "violet",
] as const;

export type GlassSurfaceVariant = (typeof GLASS_SURFACE_VARIANTS)[number];
export type GlassSurfaceIntensity = "subtle" | "medium";
export type GlassSurfaceElement = "div" | "section" | "article" | "aside";

type GlassSurfaceProps = ComponentPropsWithoutRef<"div"> & {
  as?: GlassSurfaceElement;
  children: ReactNode;
  intensity?: GlassSurfaceIntensity;
  variant?: GlassSurfaceVariant;
};

export function glassSurfaceClassName(className?: string): string {
  return cn("glass-surface", className);
}

export function GlassSurface({
  as = "div",
  children,
  className,
  intensity = "subtle",
  variant = "neutral",
  ...props
}: GlassSurfaceProps) {
  const Component: ElementType = as;

  return (
    <Component
      data-intensity={intensity}
      data-slot="glass-surface"
      data-variant={variant}
      className={glassSurfaceClassName(className)}
      {...props}
    >
      {children}
    </Component>
  );
}
