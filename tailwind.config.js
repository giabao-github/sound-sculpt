/** @type {import('tailwindcss').Config} */

import { fontFamily } from 'tailwindcss/defaultTheme';

export const content = [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    fontFamily: {
      inter: ['var(--font-inter)', ...fontFamily.sans],
      mont: ['var(--font-mont)', ...fontFamily.sans],
      bungee: ['var(--font-bungee-spice)', ...fontFamily.sans],
    },
    colors: {
      dark: "#1b1b1b",
      light: "#f5f5f5",
      primary: "#B63E96",
      primaryDark: "#58E6D9",
    },
    animation: {
      'spin-slow': 'spin 8s linear infinite',
    },
    backgroundImage: {
      circularLight: 'repeating-radial-gradient(rgba(0, 0, 0, 0.4) 2px, #f5f5f5 5px, #f5f5f5 100px);'
    }
  }, 
};
export const plugins = [];

