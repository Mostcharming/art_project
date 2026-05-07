const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

// Ensure proper module support for web and handle import.meta
config.resolver.unstable_enablePackageExports = true;
config.transformer.getTransformOptions = async () => ({
    transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
    },
});

module.exports = withNativeWind(config, { input: './globals.css' })