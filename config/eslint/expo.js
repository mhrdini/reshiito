import { config as baseConfig } from './base.js'

/* eslint-env node */

const expoConfig = require('eslint-config-expo/flat')

/**
 * A custom ESLint configuration for libraries that use Expo.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = [
  ...baseConfig,
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      'react/display-name': 'off',
    },
  },
]
