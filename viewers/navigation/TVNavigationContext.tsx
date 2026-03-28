import React, { createContext, useCallback, useContext, useState } from 'react';

export type ScreenName = 'Landing' | 'Home2';

/** Total number of gallery cards that can receive focus (non-partial cards: indices 1-5) */
export const FOCUSABLE_CARD_COUNT = 5;
/** Maps a focusable index (0-4) → CARDS array index (1-5, skipping partial edge cards) */
export const focusableToCardIndex = (focusable: number) => focusable + 1;

interface TVNavigationContextType {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
  canGoBack: boolean;
  /** Index of the currently focused gallery card (0 … FOCUSABLE_CARD_COUNT-1) */
  focusedCardIndex: number;
  /** Move focus one card to the left, wrapping around */
  focusLeft: () => void;
  /** Move focus one card to the right, wrapping around */
  focusRight: () => void;
  /** Reset focus to the center card */
  resetFocus: () => void;
}

const TVNavigationContext = createContext<TVNavigationContextType | undefined>(
  undefined,
);

export function TVNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [screenStack, setScreenStack] = useState<ScreenName[]>(['Landing']);
  // Default focus on center card (focusable index 2 → CARDS[3], the center card)
  const [focusedCardIndex, setFocusedCardIndex] = useState(2);

  const currentScreen = screenStack[screenStack.length - 1];
  const canGoBack = screenStack.length > 1;

  const navigate = useCallback((screen: ScreenName) => {
    setScreenStack(prev => [...prev, screen]);
  }, []);

  const goBack = useCallback(() => {
    setScreenStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const focusLeft = useCallback(() => {
    setFocusedCardIndex(prev =>
      prev > 0 ? prev - 1 : FOCUSABLE_CARD_COUNT - 1,
    );
  }, []);

  const focusRight = useCallback(() => {
    setFocusedCardIndex(prev =>
      prev < FOCUSABLE_CARD_COUNT - 1 ? prev + 1 : 0,
    );
  }, []);

  const resetFocus = useCallback(() => {
    setFocusedCardIndex(2);
  }, []);

  return (
    <TVNavigationContext.Provider
      value={{
        currentScreen,
        navigate,
        goBack,
        canGoBack,
        focusedCardIndex,
        focusLeft,
        focusRight,
        resetFocus,
      }}
    >
      {children}
    </TVNavigationContext.Provider>
  );
}

export function useTVNavigation() {
  const context = useContext(TVNavigationContext);
  if (!context) {
    throw new Error('useTVNavigation must be used within TVNavigationProvider');
  }
  return context;
}
