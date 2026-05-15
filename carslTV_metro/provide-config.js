#!/usr/bin/env node
console.log(JSON.stringify({
  root: process.cwd(),
  reactNativePath: require.resolve('react-native'),
  reactNativeVersion: '0.85',
  project: {
    android: {
      sourceDir: require('path').join(process.cwd(), 'android'),
      appName: 'app',
      packageName: 'com.carsltv',
      applicationId: 'com.carsltv',
      mainActivity: '.MainActivity',
      assets: []
    }
  },
  dependencies: {},
  commands: [],
  healthChecks: [],
  platforms: { android: {} },
  assets: []
}, null, 2));
