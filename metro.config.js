const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Block backend folder from Metro bundler
config.watchFolders = [];
config.resolver.blockList = [
  /node_modules\/backend\/.*/,
  /\.\/backend\/.*/,
  /backend\/.*/,
  /.*\/backend\/.*/,
];

// Exclude backend from watch list
config.resolver.sourceExts = ['tsx', 'ts', 'jsx', 'js', 'json'];
config.resolver.assetExts = ['png', 'gif', 'jpg', 'jpeg', 'webp', 'svg', 'otf', 'ttf'];

module.exports = config;
