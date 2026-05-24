/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: ['text-maku-green', 'bg-maku-green', 'border-maku-green', 'ring-maku-green'],
  theme: {
    extend: {
      colors: {
        "maku-green": {
          DEFAULT: "#ccff00",
          rgb: "204 255 0", // for opacity utilities
        },
      },
      fontFamily: {
        label: ["var(--font-label)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        eqBar: {
          from: { height: "3px" },
          to: { height: "14px" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up-1": "fade-up 0.6s 0.1s ease-out both",
        "fade-up-2": "fade-up 0.6s 0.2s ease-out both",
        "fade-up-3": "fade-up 0.6s 0.3s ease-out both",
        "fade-up-4": "fade-up 0.6s 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
