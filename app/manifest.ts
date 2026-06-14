import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SuoOps — Invoice & Expense Management",
    short_name: "SuoOps",
    description:
      "Create invoices, track payments, and manage expenses — straight from WhatsApp. Built for Small Scale Businesses (SMEs).",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0a1628",
    theme_color: "#16a34a",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
