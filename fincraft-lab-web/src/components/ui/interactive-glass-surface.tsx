"use client";

import {
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type PointerEvent,
} from "react";

import {
  glassSurfaceClassName,
  type GlassSurfaceIntensity,
  type GlassSurfaceVariant,
} from "./glass-surface";

type InteractiveGlassSurfaceProps = ComponentPropsWithoutRef<"button"> & {
  intensity?: GlassSurfaceIntensity;
  variant?: GlassSurfaceVariant;
};

function resetPointerStyles(element: HTMLButtonElement): void {
  element.style.setProperty("--glass-pointer-opacity", "0");
  element.style.setProperty("--glass-shift-x", "0px");
  element.style.setProperty("--glass-shift-y", "0px");
}

export function InteractiveGlassSurface({
  className,
  intensity = "medium",
  onPointerLeave,
  onPointerMove,
  type = "button",
  variant = "neutral",
  ...props
}: InteractiveGlassSurfaceProps) {
  const surfaceRef = useRef<HTMLButtonElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(event);
    if (event.pointerType !== "mouse") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    pointerRef.current = { x: event.clientX, y: event.clientY };
    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      const element = surfaceRef.current;
      frameRef.current = null;
      if (!element) return;

      const bounds = element.getBoundingClientRect();
      const xRatio = (pointerRef.current.x - bounds.left) / bounds.width;
      const yRatio = (pointerRef.current.y - bounds.top) / bounds.height;
      element.style.setProperty("--glass-pointer-x", `${xRatio * 100}%`);
      element.style.setProperty("--glass-pointer-y", `${yRatio * 100}%`);
      element.style.setProperty("--glass-pointer-opacity", "0.32");
      element.style.setProperty("--glass-shift-x", `${(xRatio - 0.5) * 6}px`);
      element.style.setProperty("--glass-shift-y", `${(yRatio - 0.5) * 6}px`);
    });
  };

  const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(event);
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    resetPointerStyles(event.currentTarget);
  };

  return (
    <button
      ref={surfaceRef}
      type={type}
      data-intensity={intensity}
      data-interactive="true"
      data-slot="interactive-glass-surface"
      data-variant={variant}
      className={glassSurfaceClassName(className)}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      {...props}
    />
  );
}
