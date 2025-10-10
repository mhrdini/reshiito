/* eslint-env node */
import { config as expoConfig } from '@config/eslint/expo'
import { defineConfig } from 'eslint/config'

const config = defineConfig([...expoConfig])
export default config
