#!/usr/bin/env node
const path = require('path');

const config = {
  root: process.cwd(),
  reactNativePath: path.join(process.cwd(), 'node_modules', 'react-native'),
  reactNativeVersion: '0.85',
  project: {
    android: {
      sourceDir: path.join(process.cwd(), 'android'),
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
  platforms: {
    android: {}
  },
  assets: []
};

console.log(JSON.stringify(config, null, 2));

