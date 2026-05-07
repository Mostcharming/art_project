import { Platform } from "react-native";

/**
 * TV-specific configuration and utilities
 * Provides constants and helpers for Android TV optimization
 */

export const TV_CONFIG = {
  // Whether the app is running on a TV platform
  IS_TV_PLATFORM: Platform.OS === "android",

  // Focus management
  FOCUS: {
    // Minimum distance between focusable elements (in pixels)
    PROXIMITY_THRESHOLD: 50,
    // Default focus index on screen load
    DEFAULT_FOCUS_INDEX: 0,
  },

  // UI dimensions optimized for TV
  DIMENSIONS: {
    // Standard safe area margins for TV (10% of screen)
    SAFE_AREA_MARGIN: "10%",
    // Minimum touch target size for TV remote (48dp recommended)
    MIN_TAP_TARGET: 48,
    // Text sizes readable from TV distance
    TEXT_SIZES: {
      SMALL: 14,
      MEDIUM: 18,
      LARGE: 24,
      EXTRA_LARGE: 32,
    },
  },

  // Animation/Transition timings
  ANIMATION: {
    // Focus highlight animation duration (ms)
    FOCUS_ANIMATION_DURATION: 200,
    // Transition duration for screen changes (ms)
    TRANSITION_DURATION: 300,
  },

  // Accessibility
  ACCESSIBILITY: {
    // Enable enhanced accessibility for TV
    ENHANCED_LABELS: true,
    // Announcement delay for focus changes (ms)
    ANNOUNCEMENT_DELAY: 500,
  },

  // Remote control
  REMOTE: {
    // Double-tap timeout for confirming selection (ms)
    DOUBLE_TAP_TIMEOUT: 300,
    // Repeat key press delay (ms)
    REPEAT_KEY_DELAY: 100,
  },
};

/**
 * Check if device is likely a TV based on screen characteristics
 */
export function isLikelyTV(screenDiagonalInches: number = 55): boolean {
  // Assume anything larger than 40 inches is a TV
  return screenDiagonalInches > 40;
}

/**
 * Get TV-optimized spacing value
 */
export function getTVSpacing(scale: number = 1): number {
  // Base spacing for TV is larger than mobile
  const BASE_SPACING = 16;
  return BASE_SPACING * scale;
}

/**
 * Get TV-safe area insets
 */
export function getTVSafeAreaInsets() {
  return {
    top: 48,
    bottom: 48,
    left: 48,
    right: 48,
  };
}
