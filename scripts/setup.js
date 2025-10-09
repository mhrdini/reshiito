#!/usr/bin/env node
const { execSync } = require('child_process')

try {
  console.log('➡️ Installing all pnpm dependencies...')
  execSync('pnpm install -r', { stdio: 'inherit' })
  console.log('✅ All pnpm dependencies installed successfully!')
  console.log('➡️ Commencing Python setup...')
  execSync('pnpm run setup:python', { stdio: 'inherit' })
} catch (err) {
  console.error('❌ Error during project setup:', err)
  process.exit(1)
}
