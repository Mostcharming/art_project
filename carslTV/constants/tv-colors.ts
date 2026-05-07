/**
 * TV-safe color palette optimized for viewing on large screens
 * Uses colors with good contrast for 10-foot viewing distance
 */

export const tvColors = {
  // Primary colors
  primary: "#FFFFFF",
  primaryLight: "#F5F5F5",
  primaryDark: "#E0E0E0",

  // Secondary colors
  secondary: "#BB86FC",
  secondaryLight: "#E7D5FF",
  secondaryDark: "#9155FD",

  // Accent colors
  accent: "#03DAC6",
  accentLight: "#95F1EB",
  accentDark: "#03A39D",

  // Backgrounds
  backgroundDark: "#121212",
  backgroundMedium: "#1E1E1E",
  backgroundLight: "#2C2C2C",

  // Text colors
  textPrimary: "#FFFFFF",
  textSecondary: "#B3B3B3",
  textTertiary: "#808080",
  textInverse: "#000000",

  // Status colors
  success: "#4CAF50",
  error: "#FF6B6B",
  warning: "#FFC107",
  info: "#2196F3",

  // Focus indicators
  focusBorder: "#FFFFFF",
  focusBackground: "rgba(255, 255, 255, 0.1)",

  // Transparent overlays
  overlay50: "rgba(0, 0, 0, 0.5)",
  overlay80: "rgba(0, 0, 0, 0.8)",

  // Gradient overlays
  gradientStart: "rgba(0, 0, 0, 0)",
  gradientEnd: "rgba(0, 0, 0, 0.8)",
};

/**
 * Get appropriate color based on focus state
 */
export function getColorByFocus(
  isFocused: boolean,
  focusedColor: string = tvColors.focusBorder,
  blurredColor: string = tvColors.textSecondary
): string {
  return isFocused ? focusedColor : blurredColor;
}
