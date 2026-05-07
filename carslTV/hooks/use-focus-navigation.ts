import { useState } from "react";
import { useTVRemote } from "./use-tv-remote";

interface FocusNavigationConfig {
  itemCount: number;
  columns?: number;
  rows?: number;
  initialIndex?: number;
  onIndexChange?: (newIndex: number) => void;
  wrap?: boolean; // Whether to wrap around when reaching edges
}

/**
 * Advanced hook for managing focus in grid or list layouts
 * Handles both horizontal and vertical navigation
 */
export function useFocusNavigation(config: FocusNavigationConfig) {
  const {
    itemCount,
    columns = 1,
    rows = 1,
    initialIndex = 0,
    onIndexChange,
    wrap = false,
  } = config;

  const [focusedIndex, setFocusedIndex] = useState(initialIndex);

  const handleFocusChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < itemCount) {
      setFocusedIndex(newIndex);
      onIndexChange?.(newIndex);
    } else if (wrap) {
      // Wrap around to opposite end
      const wrappedIndex = ((newIndex % itemCount) + itemCount) % itemCount;
      setFocusedIndex(wrappedIndex);
      onIndexChange?.(wrappedIndex);
    }
  };

  // Set up TV remote with grid navigation
  useTVRemote({
    onLeft: () => {
      const newIndex = focusedIndex - 1;
      handleFocusChange(newIndex);
    },
    onRight: () => {
      const newIndex = focusedIndex + 1;
      handleFocusChange(newIndex);
    },
    onUp: () => {
      const newIndex = focusedIndex - columns;
      handleFocusChange(newIndex);
    },
    onDown: () => {
      const newIndex = focusedIndex + columns;
      handleFocusChange(newIndex);
    },
  });

  return {
    focusedIndex,
    setFocusedIndex: handleFocusChange,
  };
}

/**
 * Get which row and column a given index is at in a grid
 */
export function getGridPosition(
  index: number,
  columns: number
): { row: number; col: number } {
  return {
    row: Math.floor(index / columns),
    col: index % columns,
  };
}

/**
 * Get the index from row and column position
 */
export function getIndexFromPosition(
  row: number,
  col: number,
  columns: number
): number {
  return row * columns + col;
}
