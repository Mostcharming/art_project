import React from 'react';
import { View, ViewStyle } from 'react-native';

/**
 * Screen size configurations for Android TV
 * Each screen has unique dimensions to create visual hierarchy
 */
export const SCREEN_SIZES: Record<string, ViewStyle> = {
  Home2: {
    width: '100%',
    height: '100%',
  },
  Landing: {
    width: '100%',
    height: '100%',
  },
  SignIn: {
    width: '100%',
    height: '100%',
  },
};

interface TVLayoutProps {
  screenName: string;
  children: React.ReactNode;
  customStyle?: ViewStyle;
}

/**
 * TVLayout - Wrapper component for all TV screens
 * - Provides consistent black background
 * - Applies unique sizing per screen
 * - Ensures proper layout on Android TV
 */
export function TVLayout({ screenName, children, customStyle }: TVLayoutProps) {
  const screenSize = SCREEN_SIZES[screenName] || SCREEN_SIZES.Landing;

  return (
    <View
      className="bg-black"
      style={[
        {
          flex: 1,
          backgroundColor: '#000000',
        },
        screenSize,
        customStyle,
      ]}
    >
      {children}
    </View>
  );
}
