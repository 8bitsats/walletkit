const colors = require("tailwindcss/colors");

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

const coolGray = {
  DEFAULT: "#6e7582",
  50: "#f9fafb",
  100: "#f0f1f3",
  150: "#eff1f4",
  200: "#d9dbdf",
  300: "#AAB8C1",
  400: "#9CA3AF",
  500: "#6B7280",
  600: "#4B5563",
  700: "#374151",
  800: "#161E26",
  900: "#050505",
};

const warmGray = {
  DEFAULT: "#6e7582",
  50: "#f9fafb",
  100: "#f0f1f3",
  150: "#eff1f4",
  200: "#d9dbdf",
  300: "#b7bbc2",
  400: "#8f959f",
  500: "#6e7582",
  600: "#555e6e",
  700: "#3e4859",
  800: "#222222",
  850: "#181818",
  900: "#050505",
};

const grays = {
  DEFAULT: "#6e7582",
  50: "#f9fafb",
  100: "#f0f1f3",
  150: "#eff1f4",
  200: "#d9dbdf",
  300: "#b7bbc2",
  400: "#8f959f",
  500: "#6e7582",
  600: "#555e6e",
  700: "#3e4859",
  800: "#283242",
  850: "#1f2023",
  900: "#131f30",
};

const textColor = {
  DEFAULT: grays[800],
  secondary: grays[500],
};

module.exports = {
  content: ["./src/**/*.{html,ts,tsx}"],
  darkMode: "class",

  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1220px",
    },
    extend: {
      fontSize: {
        sm: ".8125rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        ...colors,
        primary,
        accent,
        gray: grays,
        warmGray,
        coolGray,
      },
      textColor,
      scale: {
        98: ".98",
        102: "1.02",
      },
      borderColor: {
        DEFAULT: grays[150],
      },
      typography: {
        sm: {
          css: {
            fontSize: ".8125rem",
            h1: {
              fontSize: ".8125rem",
            },
            h2: {
              fontSize: ".8125rem",
            },
            h3: {
              fontSize: ".8125rem",
            },
          },
        },
        DEFAULT: {
          css: {
            color: grays[500],
            strong: {
              color: grays[800],
            },
            h1: {
              color: grays[800],
              fontWeight: 500,
            },
            h2: {
              color: grays[800],
              fontWeight: 500,
            },
            h3: {
              color: grays[800],
              fontWeight: 500,
            },
            code: {
              color: grays[500],
            },
          },
        },
        light: {
          css: {
            color: grays[300],
            strong: {
              color: grays[50],
            },
            h1: {
              color: grays[50],
              fontWeight: 500,
            },
            h2: {
              color: grays[50],
              fontWeight: 500,
            },
            h3: {
              color: grays[50],
              fontWeight: 500,
            },
            code: {
              color: grays[300],
            },
          },
        },
      },
    },
  },
  variants: {
    extend: {
      typography: ["dark"],
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
