import { TV_LAYOUT } from "@/constants/tv";
import { useWindowDimensions } from "react-native";

export interface TVDimensions {
  screenWidth: number;
  screenHeight: number;
  safeZoneLeft: number;
  safeZoneRight: number;
  safeZoneTop: number;
  safeZoneBottom: number;
  contentWidth: number;
  contentHeight: number;
  isLandscape: boolean;
  isFHD: boolean;
  is4K: boolean;
  scaleFactor: number;
}

/**
 * Hook to get TV-optimized dimensions and safe zones
 */
export function useTVDimensions(): TVDimensions {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const screenWidth = width;
  const screenHeight = height;

  // Determine resolution type
  const isFHD = screenWidth <= 1920 && screenHeight <= 1080;
  const is4K = screenWidth >= 3840 || screenHeight >= 2160;

  // Calculate safe zones (10% on each side)
  const horizontalMargin = screenWidth * TV_LAYOUT.SAFE_ZONE_PERCENTAGE;
  const verticalMargin = screenHeight * TV_LAYOUT.SAFE_ZONE_PERCENTAGE;

  // Calculate scale factor for responsive design
  // Base scale is 1920x1080
  const baseFHDWidth = 1920;
  const scaleFactor = screenWidth / baseFHDWidth;

  return {
    screenWidth,
    screenHeight,
    safeZoneLeft: horizontalMargin,
    safeZoneRight: horizontalMargin,
    safeZoneTop: verticalMargin,
    safeZoneBottom: verticalMargin,
    contentWidth: screenWidth - horizontalMargin * 2,
    contentHeight: screenHeight - verticalMargin * 2,
    isLandscape,
    isFHD,
    is4K,
    scaleFactor,
  };
}

/**
 * Scale a dimension value based on TV resolution
 */
export function scaleTV(baseValue: number, tvDimensions: TVDimensions): number {
  return baseValue * tvDimensions.scaleFactor;
}

/**
 * Get responsive font size for TV
 */
export function getResponsiveFontSize(
  baseFontSize: number,
  tvDimensions: TVDimensions
): number {
  return Math.round(baseFontSize * tvDimensions.scaleFactor);
}

/**
 * Check if TV resolution meets minimum requirements
 */
export function isTVResolutionValid(tvDimensions: TVDimensions): boolean {
  // Minimum valid TV resolution: 1280x720 (720p)
  return tvDimensions.screenWidth >= 1280 && tvDimensions.screenHeight >= 720;
}

/**
 * Format dimensions for logging/debugging
 */
export function formatTVDimensions(tvDimensions: TVDimensions): string {
  return (
    `TV Dimensions: ${tvDimensions.screenWidth}x${tvDimensions.screenHeight} ` +
    `(${tvDimensions.isFHD ? "FHD" : tvDimensions.is4K ? "4K" : "Other"}) ` +
    `Scale: ${tvDimensions.scaleFactor.toFixed(2)}x`
  );
}
