import type { Metadata } from "next";
import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { AuthProvider } from "@/features/auth/auth-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-body" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], display: "swap", variable: "--font-heading" });

export const metadata: Metadata = {
  metadataBase: new URL("https://suoops.com"),
  title: {
    default: "SuoOps — The Commerce Operating System for African Business",
    template: "%s | SuoOps",
  },
  description:
    "SuoOps is the commerce operating system for African business — a buyer-protected storefront with built-in courier delivery, online payments, orders, inventory and invoicing in one platform. Sell, get paid, deliver nationwide, and grow.",
  keywords: [
    "commerce operating system",
    "marketplace Nigeria",
    "buyer protection",
    "storefront",
    "courier delivery",
    "nationwide delivery",
    "online payments",
    "WhatsApp commerce",
    "invoice",
    "inventory",
    "small business",
    "Nigeria",
  ],
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://suoops.com",
    siteName: "SuoOps",
    title: "SuoOps — Sell, Get Paid & Grow, all in one place",
    description:
      "The commerce operating system for African business: a buyer-protected storefront with courier delivery, payments, orders, inventory and invoicing — built for how you already sell on WhatsApp.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SuoOps — The Commerce Operating System for African Business",
    description:
      "Sell, get paid, deliver nationwide, and grow — with buyer protection built in. Commerce, operations & trust in one platform.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Google tag (gtag.js) — GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DB7HG9NZNN"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              // Consent Mode v2 — analytics + ads granted by default (NDPA, non-EEA
              // audience) so GA4 measures and Google Ads remarketing works. The
              // CookieConsent banner lets users opt out.
              gtag('consent', 'default', {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted',
              });
              gtag('config', 'G-DB7HG9NZNN');
              // Google Ads — enables conversion tracking + remarketing for the
              // AW-17976378572 account. Conversion events are fired from
              // src/lib/gtag-events.ts (send_to: AW-.../<label>).
              gtag('config', 'AW-17976378572');
            `,
          }}
        />
      </head>
      <body className="font-body text-brand-text">
        <ReactQueryProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: "12px",
                  background: "#0B3318",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 500,
                  boxShadow: "0 10px 30px rgba(11,51,24,0.25)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "12px 16px",
                },
                success: {
                  iconTheme: { primary: "#14B56A", secondary: "#fff" },
                },
                error: {
                  iconTheme: { primary: "#E11D48", secondary: "#fff" },
                  style: {
                    background: "#1f0b0b",
                    border: "1px solid rgba(225,29,72,0.4)",
                  },
                },
              }}
            />
          </AuthProvider>
        </ReactQueryProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
