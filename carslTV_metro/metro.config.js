const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Custom resolver to handle missing modules
    resolverMainFields: ['react.native', 'browser', 'main'],
    blockList: [
      // Don't try to resolve Vibration from react-native
      /node_modules\/react-native\/Libraries\/Vibration\//,
    ],
  },
  transformer: {
    // Make metro more lenient with missing modules
    allowOptionalDependencies: true,
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
