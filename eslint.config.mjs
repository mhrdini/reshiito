/* eslint-env node */
import { config as baseConfig } from '@config/eslint/base'
import { defineConfig } from 'eslint/config'

const config = defineConfig([
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    ignores: [
      'apps/server/**', // ignore all Python files
      'packages/ocr_core/**', // ignore all Python files
      'dist/**', // example: ignore build output
      '**/*.py', // ignore any Python files anywhere
    ],
  },
  {
    files: ['**/*.[jt]s', 'scripts/**/*.[jt]s', 'apps/mobile/**/*.[jt]s'],
  },
])
export default config
