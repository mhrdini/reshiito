#!/usr/bin/env node
const { execSync } = require('child_process')
const os = require('os')

try {
  console.log('➡️ Generating TypeScript types...')

  const platform = os.platform() // 'darwin', 'win32', 'linux', etc.
  if (platform === 'win32') {
    execSync('pnpm run generate:types:windows', { stdio: 'inherit' })
  } else {
    execSync('pnpm run generate:types:unix', { stdio: 'inherit' })
  }
} catch (err) {
  console.error('❌ Error:', err)
  process.exit(1)
}
