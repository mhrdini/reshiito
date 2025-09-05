import baseConfig from '@config/tailwind'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', '../../packages/ui/**/*.{ts,tsx}'],
  presets: [baseConfig, require('nativewind/preset')],
  theme: {
    extend: {}
  },
  plugins: []
}
