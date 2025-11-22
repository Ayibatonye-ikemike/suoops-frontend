import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Primary & Neutrals
          evergreen: "#0B3318", // Deep, confident brand base for headers, navs, app chrome
          charcoal: "#0F1E17", // Text and icons on light surfaces (accessible)
          
          // Accents & Surfaces
          jade: "#14B56A", // Primary CTAs, success states, highlights
          teal: "#0F766E", // Secondary buttons, chips, charts, focus rings
          citrus: "#BFF74A", // Energetic accent for promos/badges (use sparingly, <10%)
          mint: "#E8F5EC", // Light cards/surfaces
          
          // Legacy mappings for compatibility
          primary: "#0B3318", // Evergreen
          primaryHover: "#14B56A", // Jade
          secondary: "#0F766E", // Deep Teal
          background: "#E8F5EC", // Mint Mist
          backgroundAlt: "#FFFFFF",
          card: "#FFFFFF",
          border: "#0F766E20", // Teal with opacity
          text: "#0F1E17", // Charcoal Green
          textMuted: "#0F1E1780", // Charcoal with opacity
          statusPaidBg: "#14B56A20", // Jade light
          statusPaidText: "#0B3318", // Evergreen
          statusPendingBg: "#BFF74A40", // Citrus light
          statusPendingText: "#0F1E17", // Charcoal
          accent: "#14B56A", // Jade
          accentMuted: "#0F766E", // Teal
          surface: "#E8F5EC", // Mint
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
