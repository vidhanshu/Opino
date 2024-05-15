module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFCC2E",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#111111",
          200: "#292929",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        rblack: ["Roboto-Black", "sans-serif"],
        rblackitalic: ["Roboto-BlackItalic", "sans-serif"],
        rbold: ["Roboto-Bold", "sans-serif"],
        rbolditalic: ["Roboto-BoldItalic", "sans-serif"],
        ritalic: ["Roboto-Italic", "sans-serif"],
        rlight: ["Roboto-Light", "sans-serif"],
        rlightitalic: ["Roboto-LightItalic", "sans-serif"],
        rmedium: ["Roboto-Medium", "sans-serif"],
        rmediumitalic: ["Roboto-MediumItalic", "sans-serif"],
        rregular: ["Roboto-Regular", "sans-serif"],
        rthin: ["Roboto-Thin", "sans-serif"],
        rthinitalic: ["Roboto-ThinItalic", "sans-serif"],
        spacemono: ["SpaceMono-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
