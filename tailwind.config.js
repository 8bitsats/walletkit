const primary = {
  DEFAULT: "#3D9292",
  50: "#ABDCDC",
  100: "#9CD6D6",
  200: "#80CACA",
  300: "#63BEBE",
  400: "#49AFAF",
  500: "#3D9292",
  600: "#2C6A6A",
  700: "#1C4343",
  800: "#0B1B1B",
  900: "#000000",
};

const accent = {
  DEFAULT: "#CE5793",
  50: "#F7E5EE",
  100: "#F3D5E4",
  200: "#EAB6D0",
  300: "#E096BC",
  400: "#D777A7",
  500: "#CE5793",
  600: "#B73577",
  700: "#8C295B",
  800: "#611C3F",
  900: "#350F22",
};

const grays = {
  DEFAULT: "#696969",
  50: "#C5C5C5",
  100: "#BBBBBB",
  200: "#A6A6A6",
  300: "#929292",
  400: "#7D7D7D",
  500: "#696969",
  600: "#4D4D4D",
  700: "#313131",
  800: "#151515",
  900: "#000000",
};

const textColor = {
  DEFAULT: grays[900],
  secondary: grays[500],
};

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,

  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1220px",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary,
        accent,
        gray: grays,
      },
      textColor,
      scale: {
        98: ".98",
        102: "1.02",
      },
      typography: {
        DEFAULT: {
          css: {
            color: textColor.DEFAULT,
            strong: {
              color: textColor.secondary,
            },
            h1: {
              color: textColor.secondary,
            },
            h2: {
              color: textColor.secondary,
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
