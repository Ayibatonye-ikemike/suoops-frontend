import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#09351A", // deep logo green
          primaryHover: "#0F4725",
          surface: "#041F0F",
          accent: "#F3E5D3", // warm beige from logo
          accentMuted: "#E4D2BB",
        },
      },
    },
  },
  plugins: [],
};

export default config;
