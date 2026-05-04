/**
 * @format
 */

// Polyfill for Vibration module - Android TV doesn't support vibration
// This needs to be done before importing React Native
const RNModules = require('react-native');
if (RNModules && !RNModules.Vibration) {
  RNModules.Vibration = {
    vibrate: function () {
      // No-op for Android TV
      __DEV__ && console.warn('Vibration is not supported on this device');
    },
    cancel: function () {
      // No-op
    },
  };
}

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
