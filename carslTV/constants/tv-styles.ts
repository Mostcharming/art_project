import { TV_CONFIG } from "@/constants/tv-config";
import { StyleSheet } from "react-native";

/**
 * TV-optimized styles that should be applied globally
 * Ensures good visibility and navigation on TV screens
 */

export const tvStyles = StyleSheet.create({
  // Container for full-screen TV content
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  // Safe area for TV content (accounts for overscan)
  safeArea: {
    flex: 1,
    paddingVertical: TV_CONFIG.DIMENSIONS.SAFE_AREA_MARGIN as any,
    paddingHorizontal: TV_CONFIG.DIMENSIONS.SAFE_AREA_MARGIN as any,
  },

  // Focusable element base styles
  focusable: {
    // Use larger touch targets for TV remotes
    minHeight: TV_CONFIG.DIMENSIONS.MIN_TAP_TARGET,
    minWidth: TV_CONFIG.DIMENSIONS.MIN_TAP_TARGET,
  },

  // Focus ring effect (shown when element is focused)
  focusRing: {
    borderWidth: 4,
    borderColor: "#FFFFFF",
    borderRadius: 8,
  },

  // Transition layer for smooth animations
  transitionLayer: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },

  // Text styles optimized for TV viewing distance
  textSmall: {
    fontSize: TV_CONFIG.DIMENSIONS.TEXT_SIZES.SMALL,
    color: "#FFFFFF",
  },

  textMedium: {
    fontSize: TV_CONFIG.DIMENSIONS.TEXT_SIZES.MEDIUM,
    color: "#FFFFFF",
  },

  textLarge: {
    fontSize: TV_CONFIG.DIMENSIONS.TEXT_SIZES.LARGE,
    color: "#FFFFFF",
  },

  textExtraLarge: {
    fontSize: TV_CONFIG.DIMENSIONS.TEXT_SIZES.EXTRA_LARGE,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  // Button styles for TV (must be touchable with remote)
  buttonBase: {
    minHeight: TV_CONFIG.DIMENSIONS.MIN_TAP_TARGET,
    minWidth: TV_CONFIG.DIMENSIONS.MIN_TAP_TARGET,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  buttonFocused: {
    borderWidth: 3,
    borderColor: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  buttonBlurred: {
    backgroundColor: "transparent",
  },

  // Overlay for TV menu/modal backgrounds
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
});

/**
 * Combine base styles with focus state
 */
export function getFocusableStyles(isFocused: boolean) {
  return [tvStyles.focusable, isFocused && tvStyles.focusRing];
}
