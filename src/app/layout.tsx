import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VisitorTracker } from "@/components/VisitorTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Khairo Tour - Haji & Umroh Terpercaya",
  description: "Layanan tour Haji dan Umroh terpercaya dengan harga terjangkau",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <GoogleAnalytics />
        <VisitorTracker />
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster position="top-center" richColors />
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
