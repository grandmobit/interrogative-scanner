const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper asset handling
config.resolver.assetExts.push(
  // Adds support for additional asset types
  'bin', 'txt', 'jpg', 'png', 'json', 'mp4', 'ttf', 'otf', 'xml'
);

// Configure for better Android compatibility
config.transformer.minifierConfig = {
  ecma: 8,
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;
