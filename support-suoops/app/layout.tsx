import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "./site-chrome";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SuoOps Support - Help Center",
  description: "Get help with SuoOps. Browse articles, FAQs, and contact our support team.",
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-slate-900 antialiased`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}

