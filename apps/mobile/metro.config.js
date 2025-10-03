const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const config = { ...getDefaultConfig(__dirname) }

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  '~': path.resolve(__dirname, 'src'),
  '@app': path.resolve(__dirname, '../../packages/app/src'),
  '@ui': path.resolve(__dirname, '../../packages/ui/src'),
}

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
]

config.watchFolders = [
  path.resolve(__dirname, '../../packages/app'),
  path.resolve(__dirname, '../../packages/ui'),
]

module.exports = withNativeWind(config, { input: './global.css' })
