import { useState } from "react";
import type { ActiveSlot, AvailableElement } from "../types/craft-element.type";

export function useCraftBaySelection() {
  const [activeSlot, setActiveSlot] = useState<ActiveSlot>("left");
  const [leftElement, setLeftElement] = useState<AvailableElement | null>(null);
  const [rightElement, setRightElement] = useState<AvailableElement | null>(null);

  const handleSelectElement = (element: AvailableElement) => {
    if (activeSlot === "left") {
      if (leftElement?.id === element.id) {
        setLeftElement(null);
        return;
      }
      setLeftElement(element);
      if (rightElement?.id === element.id) {
        setRightElement(null);
      }
      setActiveSlot("right");
    } else {
      if (rightElement?.id === element.id) {
        setRightElement(null);
        return;
      }
      setRightElement(element);
      if (leftElement?.id === element.id) {
        setLeftElement(null);
      }
    }
  };

  const handleClearSlot = (slot: ActiveSlot) => {
    if (slot === "left") {
      setLeftElement(null);
    } else {
      setRightElement(null);
    }
    setActiveSlot(slot);
  };

  return {
    activeSlot,
    setActiveSlot,
    leftElement,
    rightElement,
    handleSelectElement,
    handleClearSlot,
  };
}
