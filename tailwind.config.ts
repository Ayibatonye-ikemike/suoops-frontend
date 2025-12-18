import type { Config } from "tailwindcss";

const config: Config = {
  // content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          // Primary & Neutrals (exact brand guidelines)
          evergreen: "#0B3318", // Background, main brand colour
          charcoal: "#0F1E17", // Text on light backgrounds

          // Accents & Surfaces
          jade: "#14B56A", // Primary CTA buttons
          jadeHover: "#109456", // Darker shade for hover states on CTAs
          teal: "#0F766E", // Secondary UI elements
          citrus: "#BFF74A", // Promo highlights (<10%)
          textMuted: "#E8F5EC", // Light surfaces/cards

          // Legacy mappings for compatibility
          primary: "#0B3318",
          primaryHover: "#14B56A",
          secondary: "#0F766E",
          background: "#E8F5EC",
          backgroundAlt: "#FFFFFF",
          card: "#FFFFFF",
          border: "#0F766E20",
          text: "#0F1E17",
          mint: "#0F1E1780",
          statusPaidBg: "#14B56A20",
          statusPaidText: "#0B3318",
          statusPendingBg: "#BFF74A40",
          statusPendingText: "#0F1E17",
          accent: "#14B56A",
          accentMuted: "#0F766E",
          surface: "#E8F5EC",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Poppins", "Inter", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "card-hover":
          "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.05)",
      },
      animation: {
        scroll: "scroll 20s linear infinite",
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
