/* eslint-env node */

import expoConfig from 'eslint-config-expo/flat.js'

import { config as baseConfig } from './base.mjs'

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
