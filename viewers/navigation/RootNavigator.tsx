import React from 'react';
import { View } from 'react-native';
import { TVLayout } from '../layouts/TVLayout';
import { GuestScreen } from '../screens/GuestScreen';
import Home2Screen from '../screens/Home2Screen';
import { LandingScreen } from '../screens/LandingScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { TVNavigationProvider, useTVNavigation } from './TVNavigationContext';

export type RootStackParamList = {
  Landing: undefined;
  Home2: undefined;
  Guest: undefined;
  SignUp: undefined;
  SignIn: undefined;
};

function NavigationContent() {
  const { currentScreen } = useTVNavigation();

  return (
    <TVLayout screenName={currentScreen}>
      <View className="flex-1">
        {currentScreen === 'Landing' && <LandingScreen />}
        {currentScreen === 'Home2' && <Home2Screen />}
        {currentScreen === 'Guest' && <GuestScreen />}
        {currentScreen === 'SignUp' && <SignUpScreen />}
        {currentScreen === 'SignIn' && <SignInScreen />}
      </View>
    </TVLayout>
  );
}

export function RootNavigator() {
  return (
    <TVNavigationProvider>
      <NavigationContent />
    </TVNavigationProvider>
  );
}
