/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0a0a0a',
        surface: '#111111',
        'surface-raised': '#161616',
        line: '#262626',
        'line-subtle': '#1a1a1a',
        muted: '#737373',
        accent: {
          DEFAULT: '#0d9488',
          hover: '#14b8a6',
          muted: '#0d948833',
        },
        graph: {
          candidate: '#0d9488',
          person: '#737373',
          company: '#525252',
          job: '#a3a3a3',
          skill: '#404040',
          location: '#666666',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
