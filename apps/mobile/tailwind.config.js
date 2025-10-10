// import animate from 'tailwindcss-animate'
import nativewind from 'nativewind/preset'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,tsx}',
    '../../packages/ui/src/components/**/*.{js,ts,tsx}',
  ],

  presets: [nativewind],
  theme: {
    extend: {},
  },
  plugins: [],
}
