const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'wav' to the list of asset extensions to support the new alert sound
config.resolver.assetExts.push('wav');

module.exports = config;
