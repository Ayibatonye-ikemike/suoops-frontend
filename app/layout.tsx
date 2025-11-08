import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { AuthProvider } from "@/features/auth/auth-provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "SuoOps Dashboard",
  description: "Create and send invoices for your business",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-brand-background">
      <body className={`${inter.className} bg-brand-background text-brand-text`}>
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
