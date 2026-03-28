import React from 'react';
import { View } from 'react-native';
import { Home2Screen } from '../screens/Home2Screen';
import { LandingScreen } from '../screens/LandingScreen';
import { TVNavigationProvider, useTVNavigation } from './TVNavigationContext';

export type RootStackParamList = {
  Landing: undefined;
  Home2: undefined;
};

function NavigationContent() {
  const { currentScreen } = useTVNavigation();

  return (
    <View style={{ flex: 1 }}>
      {currentScreen === 'Landing' && <LandingScreen />}
      {currentScreen === 'Home2' && <Home2Screen />}
    </View>
  );
}

export function RootNavigator() {
  return (
    <TVNavigationProvider>
      <NavigationContent />
    </TVNavigationProvider>
  );
}
