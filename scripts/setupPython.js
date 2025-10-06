#!/usr/bin/env node
const { execSync } = require('child_process')
const os = require('os')

try {
  console.log('➡️ Installing global dependencies...')
  const globalDeps = ['json-schema-to-typescript']
  for (dep of globalDeps) {
    execSync(`pnpm add -g ${dep}`, { stdio: 'inherit' })
    console.log(`✅ Installed: ${dep}`)
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
