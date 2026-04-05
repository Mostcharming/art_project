import React, { createContext, useCallback, useContext, useState } from "react";

export type ScreenName = "Landing" | "Home" | "Guest" | "SignUp" | "SignIn";

/** Total number of gallery cards that can receive focus (non-partial cards: indices 1-5) */
export const FOCUSABLE_CARD_COUNT = 5;
/** Maps a focusable index (0-4) → CARDS array index (1-5, skipping partial edge cards) */
export const focusableToCardIndex = (focusable: number) => focusable + 1;

interface ScreenManagerContextType {
  currentScreen: ScreenName;
  setCurrentScreen: (screen: ScreenName) => void;
  /** Index of the currently focused gallery card (0 … FOCUSABLE_CARD_COUNT-1) */
  focusedCardIndex: number;
  /** Move focus one card to the left, wrapping around */
  focusLeft: () => void;
  /** Move focus one card to the right, wrapping around */
  focusRight: () => void;
  /** Reset focus to the center card */
  resetFocus: () => void;
}

const ScreenManagerContext = createContext<
  ScreenManagerContextType | undefined
>(undefined);

export function ScreenManagerProvider({
  children,
  initialScreen = "Landing",
}: {
  children: React.ReactNode;
  initialScreen?: ScreenName;
}) {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(initialScreen);
  // Default focus on center card (focusable index 2 → CARDS[3], the center card)
  const [focusedCardIndex, setFocusedCardIndex] = useState(2);

  const focusLeft = useCallback(() => {
    setFocusedCardIndex((prev) =>
      prev > 0 ? prev - 1 : FOCUSABLE_CARD_COUNT - 1
    );
  }, []);

  const focusRight = useCallback(() => {
    setFocusedCardIndex((prev) =>
      prev < FOCUSABLE_CARD_COUNT - 1 ? prev + 1 : 0
    );
  }, []);

  const resetFocus = useCallback(() => {
    setFocusedCardIndex(2);
  }, []);

  return (
    <ScreenManagerContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        focusedCardIndex,
        focusLeft,
        focusRight,
        resetFocus,
      }}
    >
      {children}
    </ScreenManagerContext.Provider>
  );
}

export function useScreenManager() {
  const context = useContext(ScreenManagerContext);
  if (!context) {
    throw new Error(
      "useScreenManager must be used within ScreenManagerProvider"
    );
  }
  return context;
}

/**
 * @deprecated Use useScreenManager instead. This hook is kept for backwards compatibility.
 */
export function useTVNavigation() {
  const context = useContext(ScreenManagerContext);
  if (!context) {
    throw new Error(
      "useTVNavigation must be used within ScreenManagerProvider"
    );
  }
  return {
    currentScreen: context.currentScreen,
    navigate: (screen: ScreenName) => context.setCurrentScreen(screen),
    goBack: () => {}, // No-op in manual screen management
    canGoBack: false,
    focusedCardIndex: context.focusedCardIndex,
    focusLeft: context.focusLeft,
    focusRight: context.focusRight,
    resetFocus: context.resetFocus,
  };
}

/**
 * Safe version of useScreenManager that returns a default context if provider is missing
 * @deprecated Use useScreenManager instead
 */
export function useTVNavigationSafe() {
  const context = useContext(ScreenManagerContext);

  if (!context) {
    // Return a safe default implementation
    return {
      currentScreen: "Landing" as ScreenName,
      setCurrentScreen: (screen: ScreenName) => {
        console.warn(
          "Screen change attempted without ScreenManagerProvider",
          screen
        );
      },
      focusedCardIndex: 2,
      focusLeft: () => {},
      focusRight: () => {},
      resetFocus: () => {},
    };
  }

  return context;
}
