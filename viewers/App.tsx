/**
 * CarslTV - Android TV App
 * A React Native application optimized for Android TV
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { RootNavigator } from './navigation/RootNavigator';

function App() {
  return (
    <>
      <StatusBar hidden />
      <RootNavigator />
    </>
  );
}

export default App;
