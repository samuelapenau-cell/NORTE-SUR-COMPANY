/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        paper: "#FAFAFA",
        neon: "#00FF1A",
        "neon-dim": "#00CC15",
        smoke: "#171717",
        gravel: "#333333",
        stone: "#6B7280",
        border: "rgba(51,51,51,0.2)",
        surface: "#171717",
        sand: "#00FF1A",
        "sand-light": "#33FF4D",
        "sand-dark": "#00CC15",
        bone: "#FAFAFA",
        charcoal: "#171717",
        "charcoal-mid": "#222222",
        gold: "#00FF1A",
        "gold-light": "#33FF4D",
        offwhite: "#FAFAFA",
        accent: "#00FF1A",
        rust: "#00CC15",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "split-in": {
          "0%": { clipPath: "inset(0 50% 0 50%)", opacity: "0" },
          "100%": { clipPath: "inset(0 0 0 0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "rule-grow": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grain-shift": {
          "0%": { transform: "translate(0,0)" },
          "25%": { transform: "translate(-1px,1px)" },
          "50%": { transform: "translate(1px,-1px)" },
          "75%": { transform: "translate(-1px,-1px)" },
          "100%": { transform: "translate(0,0)" },
        },
        "tag-reveal": {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
      },
      animation: {
        "split-in": "split-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "rule-grow": "rule-grow 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer: "shimmer 2s infinite linear",
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "tag-reveal": "tag-reveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "grain-shift": "grain-shift 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
