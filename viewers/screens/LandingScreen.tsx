import React from 'react';
import { View } from 'react-native';
import { HeroGallery } from './screenComponents/landing/HeroGallery';

export function LandingScreen() {
  return (
    <View className="flex-1 bg-black">
      <HeroGallery />
    </View>
  );
}
