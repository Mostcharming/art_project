import { isTV } from "@/utils/deviceUtils";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { Platform, UIManager } from "react-native";

/**
 * Hook to enable full screen mode on Android
 * - On TV: Hides navigation bar, status bar, and enables immersive mode
 * - On phones: Keeps normal navigation but can optionally hide navigation bar
 */
export const useFullScreenMode = (
  forceFullScreenOnPhone: boolean = false
): void => {
  useEffect(() => {
    const configureFullScreen = async () => {
      if (Platform.OS !== "android") {
        return;
      }

      try {
        const isTVDevice = isTV();

        if (isTVDevice || forceFullScreenOnPhone) {
          // Enable layout animations for smooth transitions
          if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
          }

          // Hide navigation bar
          await NavigationBar.setVisibilityAsync("hidden");

          // Set behavior to inset touch - shows on touch and auto-hides
          await NavigationBar.setBehaviorAsync("inset-touch");

          // Set navigation bar position to bottom
          try {
            await NavigationBar.setPositionAsync("absolute");
          } catch {
            // Position might not be available on all devices
            console.debug("Navigation bar position not available");
          }
        }
      } catch (error) {
        console.error("Error configuring full screen:", error);
      }
    };

    configureFullScreen();
  }, [forceFullScreenOnPhone]);
};

/**
 * Hook to show navigation bar (for temporary UI interactions)
 */
export const useShowNavigationBar = (): (() => Promise<void>) => {
  return async () => {
    if (Platform.OS === "android") {
      try {
        await NavigationBar.setVisibilityAsync("visible");
      } catch (error) {
        console.error("Error showing navigation bar:", error);
      }
    }
  };
};

/**
 * Hook to hide navigation bar
 */
export const useHideNavigationBar = (): (() => Promise<void>) => {
  return async () => {
    if (Platform.OS === "android") {
      try {
        await NavigationBar.setVisibilityAsync("hidden");
      } catch (error) {
        console.error("Error hiding navigation bar:", error);
      }
    }
  };
};
