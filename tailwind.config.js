/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1B6CA8',
        accent: '#27AE60',
        sos: '#E74C3C',
        surface: '#F5F5F5',
        ink: '#1A1A1A',
        muted: '#888888',
        night: '#121212',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
      },
      spacing: {
        4.5: '18px',
      },
      fontSize: {
        hero: ['72px', { lineHeight: '72px' }],
      },
    },
  },
  plugins: [],
};
