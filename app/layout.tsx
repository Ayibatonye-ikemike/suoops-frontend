import type { Metadata } from "next";
import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { AuthProvider } from "@/features/auth/auth-provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-body" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], display: "swap", variable: "--font-heading" });

export const metadata: Metadata = {
  metadataBase: new URL("https://suoops.com"),
  title: {
    default: "SuoOps — Invoice & Expense Management for Nigerian Businesses",
    template: "%s | SuoOps",
  },
  description:
    "Create and send invoices via WhatsApp or dashboard. Professional invoicing, expense tracking, and tax compliance made simple for Nigerian businesses.",
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
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "SuoOps — Invoicing for Nigerian Businesses",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "SuoOps — Invoice & Get Paid from WhatsApp",
    description:
      "Professional invoicing for Nigerian businesses. WhatsApp-first, tax-aware, mobile-friendly.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17976378572"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17976378572');
            `,
          }}
        />
      </head>
      <body className="font-body text-brand-text">
        <ReactQueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
