#!/usr/bin/env node
import { execSync } from 'child_process'
import os from 'os'

try {
  console.log('➡️ Installing global dependencies...')
  const globalDeps = ['json-schema-to-typescript']
  for (const dep of globalDeps) {
    try {
      // Check if the package is already installed globally
      execSync(`pnpm list -g ${dep}`, { stdio: 'ignore' })
      console.log(`✅ Already installed: ${dep}`)
    } catch {
      // Not installed — install it
      console.log(`⬇️ Installing ${dep}...`)
      execSync(`pnpm add -g ${dep}`, { stdio: 'inherit' })
    }
  }

  const platform = os.platform() // 'darwin', 'win32', 'linux', etc.
  if (platform === 'win32') {
    console.log('🌐 Detected Windows - running Windows setup...')
    execSync('pnpm run setup:python:windows', { stdio: 'inherit' })
  } else {
    console.log('🌐 Detected Unix-like OS - running Unix setup...')
    execSync('pnpm run setup:python:unix', { stdio: 'inherit' })
  }
} catch (err) {
  console.error('❌ Error during Python environment setup:', err)
  process.exit(1)
}
