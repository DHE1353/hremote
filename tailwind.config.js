/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#3B82F6",
          violet: "#8B5CF6",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
      },
    },
  },
  plugins: [],
};
