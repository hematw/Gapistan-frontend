const { heroui } = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "components/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/components/(accordion|autocomplete|avatar|badge|button|card|chip|divider|drawer|dropdown|form|image|input|listbox|modal|navbar|select|skeleton|slider|toggle|toast|popover|user|ripple|spinner|scroll-shadow|menu).js"
  ],
    darkMode: ["class"],
    theme: {
        extend: {
            fontFamily: {
            },
            textShadow: {
                sm: '0 1px 2px var(--tw-shadow-color)',
                DEFAULT: '0 2px 4px var(--tw-shadow-color)',
                lg: '0 8px 16px var(--tw-shadow-color)'
            },
            colors: {
                limegreen: "#bcff9d",
                dark: "#272727",
                "dark-2": "#343434",
            }
        }
    },
    plugins: [plugin(function ({ matchUtilities, theme }) {
        matchUtilities(
            {
                'text-shadow': (value) => ({
                    textShadow: value,
                }),
            }, { values: theme('textShadow') }
        )
    }), require("tailwindcss-animate"), heroui()],
}
