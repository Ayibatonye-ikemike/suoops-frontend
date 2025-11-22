import type { Metadata } from "next";
import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { AuthProvider } from "@/features/auth/auth-provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-body" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], display: "swap", variable: "--font-heading" });

export const metadata: Metadata = {
  title: "SuoOps - Invoice & Expense Management",
  description: "Create and send invoices for your business. Professional invoicing and expense tracking made simple.",
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
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
