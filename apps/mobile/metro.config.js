import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { getDefaultConfig } from 'expo/metro-config'
import { withNativeWind } from 'nativewind/metro'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

export default withNativeWind(config, { input: './src/global.css' })
