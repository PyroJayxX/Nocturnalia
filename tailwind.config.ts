import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './posts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nocturnal: {
          background: '#0a0a1a',
          text: '#e2e8f0',
          primary: '#818cf8',
          secondary: '#c084fc',
        },
      },
    },
  },
  plugins: [typography],
};

export default config;