/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { velah: "#7FCBD8" },
      boxShadow: { soft: "0 8px 24px rgba(0,0,0,.08)" },
      borderRadius: { "2xl": "1rem" },
    },
  },
  plugins: [],
};
