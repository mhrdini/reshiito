const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const config = { ...getDefaultConfig(__dirname) }

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '@': path.resolve(__dirname, 'src'),
  ui: path.resolve(__dirname, '../../packages/ui/src'),
  types: path.resolve(__dirname, '../../packages/types/src'),
}

config.resolver.nodeModulesPaths = [
  ...config.resolver.nodeModulesPaths,
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
  path.resolve(__dirname, '../../packages/ui/node_modules'),
]

config.watchFolders = [
  ...config.watchFolders,
  path.resolve(__dirname, '../../packages/ui'),
  path.resolve(__dirname, '../../packages/types'),
]

module.exports = withNativeWind(config, { input: './src/global.css' })
