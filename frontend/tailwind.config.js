/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2B34",
        mist: "#F6F8F4",
        line: "#D8E0D7",
        brand: {
          50: "#EEF8F2",
          100: "#D9F0E4",
          600: "#0E7A5F",
          700: "#075F4D",
        },
        civic: "#243B53",
        notice: "#FFF7DC",
        success: "#11845B",
        warning: "#B7791F",
        danger: "#C2410C",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(27, 43, 52, 0.08)",
      },
    },
  },
  plugins: [],
};
