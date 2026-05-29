/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        zenit: {
          navy: '#1a1b2e',
          'navy-mid': '#2d2e4a',
          amber: '#c9a84c',
          'amber-light': '#e8c97a',
          cream: '#f5f0e8',
          'cream-dark': '#ede7d9',
        }
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
