/** @type {import('tailwindcss').Config} */

import { fontFamily } from 'tailwindcss/defaultTheme';

export const content = [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
];
export const darkMode = 'class';
export const theme = {
  extend: {
    fontFamily: {
      inter: ['var(--font-inter)', ...fontFamily.sans],
      mont: ['var(--font-mont)', ...fontFamily.sans],
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
      circularLight: 'repeating-radial-gradient(rgba(0, 0, 0, 0.4) 2px, #f5f5f5 5px, #f5f5f5 100px);',
      circularDark: 'repeating-radial-gradient(#f5f5f5 2px, #1b1b1b 8px, #1b1b1b 100px);',
      circularLightLg: 'repeating-radial-gradient(rgba(0, 0, 0, 0.4) 2px, #f5f5f5 5px, #f5f5f5 80px);',
      circularDarkLg: 'repeating-radial-gradient(#f5f5f5 2px, #1b1b1b 8px, #1b1b1b 80px);',
      circularLightMd: 'repeating-radial-gradient(rgba(0, 0, 0, 0.4) 2px, #f5f5f5 5px, #f5f5f5 60px);',
      circularDarkMd: 'repeating-radial-gradient(#f5f5f5 2px, #1b1b1b 6px, #1b1b1b 60px);',
      circularLightSm: 'repeating-radial-gradient(rgba(0, 0, 0, 0.4) 2px, #f5f5f5 5px, #f5f5f5 40px);',
      circularDarkSm: 'repeating-radial-gradient(#f5f5f5 2px, #1b1b1b 4px, #1b1b1b 40px);',
    },
    filter: {
      'invert-100': 'invert(1)',
    }
  },
  screens: {
    "2xl": { max: "1536px" },       // @media (max-width: 1536px)
    "1.75xl": { max: "1472px" },    // @media (max-width: 1472px)
    "1.5xl": { max: "1408px" },     // @media (max-width: 1408px)
    "1.25xl": { max: "1344px" },    // @media (max-width: 1344px)
    "xl": { max: "1280px" },        // @media (max-width: 1280px)
    "0.75xl": { max: "1216px" },    // @media (max-width: 1216px)
    "0.5xl": { max: "1152px" },     // @media (max-width: 1160px)
    "0.25xl": { max: "1088px" },    // @media (max-width: 1088px)
    "lg": { max: "1024px" },        // @media (max-width: 1024px)
    "0.75lg": { max: "960px" },     // @media (max-width: 960px)
    "0.25lg": { max: "832px" },      // @media (max-width: 832px)
    "md": { max: "768px" },         // @media (max-width: 768px)
    "sm": { max: "640px" },         // @media (max-width: 640px)
    "xs": { max: "480px" },         // @media (max-width: 480px)
  },
};
export const variants = {
  extend: {
    filter: ['dark'],
    invert: ['dark']
  },
}
export const plugins = [];

