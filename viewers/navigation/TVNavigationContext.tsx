import React, { createContext, useCallback, useContext, useState } from 'react';

export type ScreenName = 'Landing' | 'Home2';

interface TVNavigationContextType {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
  canGoBack: boolean;
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

  const currentScreen = screenStack[screenStack.length - 1];
  const canGoBack = screenStack.length > 1;

  const navigate = useCallback((screen: ScreenName) => {
    setScreenStack(prev => [...prev, screen]);
  }, []);

  const goBack = useCallback(() => {
    setScreenStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  return (
    <TVNavigationContext.Provider
      value={{ currentScreen, navigate, goBack, canGoBack }}
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
