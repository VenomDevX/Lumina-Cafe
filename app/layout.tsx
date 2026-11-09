import type { Metadata, Viewport } from "next"
import { Fraunces, Geist, Geist_Mono } from "next/font/google"
import { CoffeeCursor } from "@/components/coffee-cursor"
import { Footer } from "@/components/footer"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
})

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  title: { default: "Lumina Café — Coffee, slow as the tide", template: "%s · Lumina Café" },
  description: "A small-batch beach café on the Palm Cove shore. Signature lattes, cold brew, sunrise espresso and sunset tastings.",
  openGraph: { type: "website", siteName: "Lumina Café" },
}

export const viewport: Viewport = {
  themeColor: "#ede3d3",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${geist.variable} ${geistMono.variable} antialiased`}>
      <head>
        {/* lets CSS hide reveal targets only when JS will animate them in */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-full">
        <a
          href="#main"
          className="label-mono fixed top-3 left-3 z-50 -translate-y-20 bg-ink px-4 py-3 text-paper focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <main id="main">{children}</main>
        <Footer />
        <Toaster position="bottom-center" theme="light" />
        <CoffeeCursor />
        <div className="grain" aria-hidden />
      </body>
    </html>
  )
}
