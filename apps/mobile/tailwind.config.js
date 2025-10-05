import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './client/**/*.{js,ts,tsx}',
    '../../packages/ui/src/components/**/*.{js,ts,tsx}',
    '../../packages/client/src/screens/**/*.{js,ts,tsx}',
    '../../packages/client/src/features/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
}
