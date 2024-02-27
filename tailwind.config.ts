import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const svgToDataUri = require("mini-svg-data-uri");
 
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
 


export default {
  content: ["./src/**/*.tsx"],
  theme: {
    darkMode: "class",
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        poppins: ['Poppins', 'sans-serif'],
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
      colors: {
        'container-bg-color': 'var(--container-bg-color)',
        'nav-bg-color': 'var(--nav-bg-color)',
        'card-bg-color': 'var(--card-bg-color)',
        'primary-color': 'var(--primary-color)',
        'tab-bg-color': 'var(--tab-bg-color)',
        'main-bg-color': 'var(--main-bg-color)',
        'nav-text-color': 'var(--nav-text-color)',
        'text-main-color': 'var(--text-main-color)',
        'text-secondary-color': 'var(--text-secondary-color)',
        'secondary-bg-color': 'var(--secondary-bg-color)',
      },
    },

  },
  plugins: [
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
  ],
} satisfies Config;
