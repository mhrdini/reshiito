#!/usr/bin/env node
const { execSync } = require('child_process')
const os = require('os')

try {
  console.log('➡️ Installing internal Python packages as editable...')

  const platform = os.platform() // 'darwin', 'win32', 'linux', etc.
  if (platform === 'win32') {
    execSync('pnpm run install:packages:windows', { stdio: 'inherit' })
  } else {
    execSync('pnpm run install:packages:unix', { stdio: 'inherit' })
  }
} catch (err) {
  console.error('❌ Error:', err)
  process.exit(1)
}
