export default function (api) {
  const appEnv = process.env.APP_ENV || 'development'
  const envFile = `.env.${appEnv}`
  api.cache(true)
  let plugins = [
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
        importSource: 'nativewind',
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: envFile,
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
  ]

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],

    plugins,
  }
}
