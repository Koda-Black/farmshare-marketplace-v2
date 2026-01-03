import type React from "react";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { NotificationInitializer } from "@/components/notification-initializer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FarmShare - Agricultural Pooled-Buy Marketplace",
    template: "%s | FarmShare",
  },
  description:
    "Empowering farmers and buyers through collective purchasing power. Join buying pools for premium agricultural products at wholesale prices.",
  keywords: [
    "agriculture",
    "marketplace",
    "farming",
    "bulk buying",
    "pooled buying",
    "Nigeria",
    "farmers",
    "agricultural products",
  ],
  authors: [{ name: "FarmShare" }],
  creator: "FarmShare",
  publisher: "FarmShare",
  metadataBase: new URL("https://farmshare-silk.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://farmshare-silk.vercel.app",
    siteName: "FarmShare",
    title: "FarmShare - Agricultural Pooled-Buy Marketplace",
    description:
      "Empowering farmers and buyers through collective purchasing power",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FarmShare - Farm Fresh Products at Your Fingertips",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FarmShare - Agricultural Pooled-Buy Marketplace",
    description:
      "Empowering farmers and buyers through collective purchasing power",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/cowrie-favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/assets/logo/cowrie-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
    other: [{ rel: "mask-icon", url: "/cowrie-favicon.svg", color: "#1a472a" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0A4D3A" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2f28" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased overflow-x-hidden`}
      >
        <ThemeProvider>
          <Suspense fallback={null}>
            <NotificationInitializer />
            <div className="flex min-h-screen flex-col overflow-x-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <Analytics />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
