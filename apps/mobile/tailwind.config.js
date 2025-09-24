import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: 'html',
  darkMode: 'class',
  content: [
    './components/**/*.{js,ts,tsx}',
    '../../packages/screens/src/**/*.{js,ts,tsx}',
    '../../packages/ui/src/**/*.{js,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  plugins: [animate],
}
