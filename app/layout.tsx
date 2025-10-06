import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { NotificationInitializer } from "@/components/notification-initializer"
import "./globals.css"

export const metadata: Metadata = {
  title: "FarmShare - Agricultural Pooled-Buy Marketplace",
  description: "Empowering farmers and buyers through collective purchasing power",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased overflow-x-hidden`}>
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
  )
}
