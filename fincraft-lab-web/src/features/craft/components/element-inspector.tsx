"use client";

import { useElementGuidance } from "../hooks/use-element-guidance";
import type { AvailableElement } from "../types/craft-element.type";
import { ElementLearningPanel } from "./element-learning-panel";

export type ElementInspectorProps = {
  elements: AvailableElement[];
  selectedElementId: string | null;
  onClose: () => void;
  onPlaceElement: (element: AvailableElement) => void;
};

export function ElementInspector({ elements, selectedElementId, onClose, onPlaceElement }: ElementInspectorProps) {
  const element = elements.find((item) => item.id === selectedElementId) ?? null;
  const { data: guidance, isLoading, isFetching } = useElementGuidance(element?.id ?? null);

  if (!element) return null;

  const matchingGuidance = guidance?.element?.id === element.id ? guidance : null;

  return (
    <div className="lab-inspector-panel" role="dialog" aria-label={`Element information for ${element.name}`}>
      <ElementLearningPanel
        element={element}
        guidance={matchingGuidance}
        isLoading={isLoading || isFetching}
        onClose={onClose}
        onPlaceElement={onPlaceElement}
      />
    </div>
  );
}
