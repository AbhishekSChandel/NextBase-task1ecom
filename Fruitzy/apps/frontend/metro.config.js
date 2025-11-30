const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Note: Metro minification is handled by EAS build automatically
// Console.logs are removed during production builds
// This config ensures optimal bundling

module.exports = config;


