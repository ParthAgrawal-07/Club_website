/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all subdirectories and files
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0a0a0a",
          blue: "#2563eb",
          cyan: "#22d3ee",
        }
      },
    },
  },
  plugins: [],
}
