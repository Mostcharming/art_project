import { Dimensions, Platform } from "react-native";

/**
 * Utility functions for detecting device type and orientation
 */

/**
 * Determines if the device is a TV
 * Android TV devices typically have:
 * - Large screen (> 5 inches diagonal)
 * - No touchscreen is required
 * - Different aspect ratios
 */
export const isTV = (): boolean => {
  if (Platform.OS !== "android") {
    return false;
  }

  // Get screen dimensions
  const { width, height } = Dimensions.get("screen");
  const screenSize = Math.sqrt(
    Math.pow(width / 160, 2) + Math.pow(height / 160, 2)
  );

  // TV screens are typically 40+ inches (diagonal), but we check for a minimum screen size
  // Also check aspect ratio - TVs often have wider aspect ratios
  const aspectRatio = width / height;

  // TV detection heuristics:
  // 1. Large screen (>7 inches diagonal)
  // 2. Common TV aspect ratios (16:9, 4:3)
  const isLargeScreen = screenSize > 7;
  const isTVAspectRatio =
    (aspectRatio > 1.5 && aspectRatio < 2.2) || // 16:9 and similar
    (aspectRatio > 1.3 && aspectRatio < 1.4); // 4:3

  return isLargeScreen || isTVAspectRatio;
};

/**
 * Determines if the device is a phone
 */
export const isPhone = (): boolean => {
  return !isTV();
};

/**
 * Get device type string
 */
export const getDeviceType = (): "tv" | "phone" => {
  return isTV() ? "tv" : "phone";
};

/**
 * Get screen orientation
 */
export const getOrientation = (): "portrait" | "landscape" => {
  const { width, height } = Dimensions.get("screen");
  return width > height ? "landscape" : "portrait";
};

/**
 * Check if device is in landscape mode
 */
export const isLandscape = (): boolean => {
  return getOrientation() === "landscape";
};

/**
 * Check if device is in portrait mode
 */
export const isPortrait = (): boolean => {
  return getOrientation() === "portrait";
};
