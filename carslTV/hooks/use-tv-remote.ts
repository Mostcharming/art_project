import { useCallback, useEffect } from "react";
import { BackHandler, Platform } from "react-native";

interface RemoteKeyConfig {
  onLeft?: () => void;
  onRight?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  onSelect?: () => void;
  onBack?: () => void;
}

/**
 * Hook to handle TV remote control navigation
 * Listens for keyboard events that TV remotes typically send
 * Compatible with Android TV and other TV platforms
 *
 * For Android TV: Uses BackHandler for back button, relies on Pressable focus for arrows
 * For Web: Uses keyboard events
 */
export function useTVRemote(config: RemoteKeyConfig) {
  const { onLeft, onRight, onUp, onDown, onSelect, onBack } = config;

  // Handle web keyboard events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Handle different key names that TV remotes might send
      switch (e.key) {
        case "ArrowLeft":
        case "Left":
          e.preventDefault();
          onLeft?.();
          break;
        case "ArrowRight":
        case "Right":
          e.preventDefault();
          onRight?.();
          break;
        case "ArrowUp":
        case "Up":
          e.preventDefault();
          onUp?.();
          break;
        case "ArrowDown":
        case "Down":
          e.preventDefault();
          onDown?.();
          break;
        case "Enter":
          e.preventDefault();
          onSelect?.();
          break;
        case " ":
          e.preventDefault();
          onSelect?.();
          break;
        case "Escape":
        case "BackSpace":
          e.preventDefault();
          onBack?.();
          break;
        default:
          break;
      }
    },
    [onLeft, onRight, onUp, onDown, onSelect, onBack]
  );

  useEffect(() => {
    // Web platform: add keyboard listeners
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }

    // Android platform: handle back button
    if (Platform.OS === "android" && onBack) {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          onBack();
          return true;
        }
      );
      return () => subscription.remove();
    }
  }, [handleKeyDown, onBack]);
}

/**
 * Utility function to calculate focusable index after navigation
 * Useful for carousel or grid-based navigation
 */
export function getNextFocusIndex(
  currentIndex: number,
  focusableIndices: number[],
  direction: "left" | "right" | "up" | "down"
): number {
  const currentPosition = focusableIndices.indexOf(currentIndex);

  switch (direction) {
    case "left":
      return currentPosition > 0
        ? focusableIndices[currentPosition - 1]
        : currentIndex;
    case "right":
      return currentPosition < focusableIndices.length - 1
        ? focusableIndices[currentPosition + 1]
        : currentIndex;
    default:
      return currentIndex;
  }
}
