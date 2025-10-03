import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,tsx}',
    '../../packages/ui/src/components/**/*.{js,ts,tsx}',
    '../../packages/app/src/screens/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
}
