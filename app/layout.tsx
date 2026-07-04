import type { Metadata } from "next";
import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { AuthProvider } from "@/features/auth/auth-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-body" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], display: "swap", variable: "--font-heading" });

export const metadata: Metadata = {
  metadataBase: new URL("https://suoops.com"),
  title: {
    default: "SuoOps — Invoice & Expense Management for SMEs",
    template: "%s | SuoOps",
  },
  description:
    "Create and send invoices via WhatsApp or dashboard. Professional invoicing, expense tracking, and tax compliance made simple for Small Scale Businesses (SMEs).",
  keywords: [
    "invoice",
    "Nigeria",
    "WhatsApp invoicing",
    "expense tracker",
    "small business",
    "payment",
    "tax",
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
    title: "SuoOps — Invoice Customers & Get Paid from WhatsApp",
    description:
      "Create invoices, track payments, manage inventory, and stay tax-aware — straight from WhatsApp. Built for freelancers and small businesses in Nigeria.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SuoOps — Invoice & Get Paid from WhatsApp",
    description:
      "Professional invoicing for Small Scale Businesses (SMEs). WhatsApp-first, tax-aware, mobile-friendly.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Google tag (gtag.js) — GA4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-DB7HG9NZNN"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              // Consent Mode v2 — default denied until the user chooses (see CookieConsent)
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                wait_for_update: 500,
              });
              gtag('config', 'G-DB7HG9NZNN');
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
