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

export async function generateMetadata(): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/settings`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) throw new Error("Failed to fetch settings");

    const settings = await response.json();

    return {
      title: settings.site_name || "Khairo Tour - Haji & Umroh Terpercaya",
      description:
        settings.site_description ||
        "Layanan tour Haji dan Umroh terpercaya dengan harga terjangkau",
      icons: settings.site_favicon
        ? {
            icon: settings.site_favicon,
            shortcut: settings.site_favicon,
            apple: settings.site_favicon,
          }
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching settings for metadata:", error);
    return {
      title: "Khairo Tour - Haji & Umroh Terpercaya",
      description:
        "Layanan tour Haji dan Umroh terpercaya dengan harga terjangkau",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className} suppressHydrationWarning>
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
