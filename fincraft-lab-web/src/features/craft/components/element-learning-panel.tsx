"use client";

import { useEffect } from "react";
import type { AvailableElement } from "../types/craft-element.type";
import type { ElementGuidance, SuggestedPartner } from "../types/element-guidance.type";

export type ElementLearningPanelProps = {
  element: AvailableElement;
  guidance: ElementGuidance | null;
  isLoading: boolean;
  onClose: () => void;
  onPlaceElement: (element: AvailableElement) => void;
};

function LearningHeader({
  element,
  categoryName,
  onClose,
}: {
  element: AvailableElement;
  categoryName: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[var(--border-subtle)] pb-2.5">
      <div className="flex items-center gap-2.5">
        <span className="surface-inset flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-xl leading-none">
          {element.emoji || "📄"}
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-craft-accent)]">
            {categoryName} &bull; {element.elementType}
          </p>
          <h3 className="text-sm font-bold text-foreground leading-snug">{element.name}</h3>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close element guide"
        className="rounded-lg p-1 text-xs text-muted-foreground hover:text-foreground hover:bg-[var(--surface-inset)]"
      >
        ✕
      </button>
    </div>
  );
}

function SuggestedPartnerList({
  partners,
  onPlaceElement,
}: {
  partners: SuggestedPartner[];
  onPlaceElement: (element: AvailableElement) => void;
}) {
  if (partners.length === 0) return null;

  return (
    <div className="space-y-2 pt-1 border-t border-[var(--border-subtle)]">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-craft-accent)]">
        Try combining with
      </h4>
      <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto">
        {partners.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() =>
              onPlaceElement({
                id: p.id,
                name: p.name,
                slug: p.slug,
                emoji: p.emoji,
                iconUrl: p.iconUrl,
                elementType: p.elementType,
                isStarter: false,
                category: { id: "", name: p.categoryName, sortOrder: 0 },
              })
            }
            className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-2.5 py-1.5 text-left text-xs font-medium hover:border-[var(--color-craft-accent)] hover:bg-[var(--surface-resting)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span>{p.emoji || "📄"}</span>
              <span className="text-foreground font-semibold">{p.name}</span>
            </div>
            <span className="text-[10px] text-[var(--color-action-primary)] font-semibold">+ Place</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ElementLearningPanel({
  element,
  guidance,
  isLoading,
  onClose,
  onPlaceElement,
}: ElementLearningPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const categoryName = element.category?.name || element.elementType;
  const isMatchingGuidance = guidance?.element?.id === element.id;
  const description = isMatchingGuidance && guidance?.element?.description
    ? guidance.element.description
    : "Financial concept specimen. Combine with other elements on the canvas to explore real-world relationships.";
  const partners = isMatchingGuidance ? guidance?.suggestedPartners || [] : [];

  return (
    <div
      role="region"
      aria-label={`About ${element.name}`}
      className="surface-card rounded-2xl border border-[var(--color-craft-accent)]/40 p-4 space-y-3 shadow-xl max-h-[500px] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
    >
      <LearningHeader element={element} categoryName={categoryName} onClose={onClose} />

      <div className="space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">What it means</h4>
        <p className="text-xs text-foreground leading-relaxed">
          {isLoading || !isMatchingGuidance ? "Loading explanation..." : description}
        </p>
      </div>

      <SuggestedPartnerList partners={partners} onPlaceElement={onPlaceElement} />

      <div className="pt-2">
        <button
          type="button"
          onClick={() => onPlaceElement(element)}
          className="w-full rounded-xl bg-[var(--color-action-primary)] py-2 text-xs font-semibold text-white shadow-xs hover:bg-[var(--color-action-hover)] transition-colors"
        >
          Place {element.name} on Canvas
        </button>
      </div>
    </div>
  );
}
