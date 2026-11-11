/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hospital: {
          blue: "#004282", // Màu xanh Đại học Y Hà Nội
          dark: "#002d5a",
          light: "#005baa",
          hover: "#003566",
          subtle: "#eef5fc",
          red: "#d32f2f",
          gray: "#f4f6f9",
          border: "#e2e8f0",
          text: "#1e293b",
          muted: "#64748b"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: "0 2px 12px -2px rgba(0, 66, 130, 0.08), 0 4px 16px rgba(0,0,0,0.02)",
        hospital: "0 4px 20px -2px rgba(0, 66, 130, 0.12)",
      }
    },
  },
  plugins: [],
}
