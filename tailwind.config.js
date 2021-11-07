const brandColors = {
  DEFAULT: "#498505",
  50: "#fdfffa",
  100: "#f8fef0",
  200: "#eefedd",
  300: "#e2fdc4",
  400: "#d9fcb0",
  500: "#cdfb98",
  600: "#a4f844",
  700: "#7add09",
  800: "#192908",
  900: "#1A3103",
};

const skin = {
  50: "#10a10e10d",
  100: "#f9f6f7",
  200: "#e6ddde",
  300: "#b69b9f",
  400: "#936c72",
  500: "#64494d",
  600: "#523c40",
  700: "#412f32",
  800: "#2f2324",
  900: "#1d1617",
};

const textColor = {
  DEFAULT: skin[700],
  secondary: skin[500],
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
        serif: ["TiemposHeadline", "serif"],
        display: ["TiemposText", "serif"],
        sans: ["'Krona One'", "sans-serif"],
      },
      fontSize: {
        xs: "0.8125rem",
        "3xl": "1.75rem",
      },
      colors: {
        skin,
        brand: brandColors,
      },
      textColor,
      scale: {
        98: ".98",
        102: "1.02",
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: "TiemposText, serif",
            color: textColor.DEFAULT,
            strong: {
              color: textColor.secondary,
            },
            h1: {
              fontFamily: "TiemposHeadline, serif",
              color: textColor.secondary,
            },
            h2: {
              fontFamily: "TiemposHeadline, serif",
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
