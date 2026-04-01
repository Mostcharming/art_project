// TV Screen sizes and safe zones
export const TV_LAYOUT = {
  // Common TV resolutions
  RESOLUTIONS: {
    FHD: { width: 1920, height: 1080 },
    "4K": { width: 3840, height: 2160 },
  },

  // Safe zone (10% margins for overscan)
  SAFE_ZONE_PERCENTAGE: 0.1,

  // Focus sizes
  FOCUS_ELEMENT_MIN_SIZE: 48, // Minimum 48dp for focus-able elements
  FOCUS_ELEMENT_PADDING: 24, // Padding around focusable elements
  FOCUS_BORDER_WIDTH: 4,

  // Text sizes for TV (larger than mobile)
  TEXT: {
    TITLE: 60,
    HEADING: 48,
    SUBTITLE: 36,
    BODY: 28,
    CAPTION: 24,
  },

  // Spacing for TV (larger than mobile)
  SPACING: {
    XS: 8,
    SM: 16,
    MD: 24,
    LG: 32,
    XL: 48,
    XXL: 64,
  },

  // Button sizing
  BUTTON: {
    HEIGHT: 60,
    MIN_WIDTH: 120,
    PADDING_HORIZONTAL: 32,
  },

  // Card sizing
  CARD: {
    PADDING: 24,
    BORDER_RADIUS: 8,
  },
};

export const TV_COLORS = {
  PRIMARY: "#FFFFFF",
  SECONDARY: "#666666",
  BACKGROUND: "#000000",
  FOCUS: "#00FF00",
  FOCUS_SHADOW: "rgba(0, 255, 0, 0.3)",
};

// Helper function to calculate safe zone
export function calculateSafeZone(
  screenWidth: number,
  screenHeight: number
): { top: number; bottom: number; left: number; right: number } {
  const horizontalMargin = screenWidth * TV_LAYOUT.SAFE_ZONE_PERCENTAGE;
  const verticalMargin = screenHeight * TV_LAYOUT.SAFE_ZONE_PERCENTAGE;

  return {
    top: verticalMargin,
    bottom: verticalMargin,
    left: horizontalMargin,
    right: horizontalMargin,
  };
}
