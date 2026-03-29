import React from 'react';
import { View } from 'react-native';
import { HeroGallery } from './screenComponents/landing/HeroGallery';

export function LandingScreen() {
  return (
    <View className="mt-4 flex-1">
      <HeroGallery />
    </View>
  );
}
