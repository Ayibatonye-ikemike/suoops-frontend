import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#004225",
          primaryHover: "#007A4D",
          secondary: "#007A4D",
          background: "#F4F4F4", // Soft gray as per guidelines
          backgroundAlt: "#F3F7F5", // Muted green tint alternative
          card: "#FFFFFF",
          border: "#E5E7EB",
          text: "#1A1A1A",
          textMuted: "#6B7280",
          statusPaidBg: "#DCFCE7", // Green-50 for paid status
          statusPaidText: "#166534", // Green-800 for paid text
          statusPendingBg: "#FEF3C7", // Amber-100 for pending status
          statusPendingText: "#92400E", // Amber-800 for pending text
          accent: "#FFFFFF",
          accentMuted: "#E5E7EB",
          surface: "#F4F4F4",
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
