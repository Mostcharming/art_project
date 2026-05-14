/**
 * Carsl TV App for Android TV
 */

import React from 'react';
import { StatusBar, View } from 'react-native';
import RootNavigator from './app/navigation/RootNavigator';

function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <RootNavigator />
    </View>
  );
}

export default App;
