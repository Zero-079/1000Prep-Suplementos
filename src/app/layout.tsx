import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Playfair_Display, Fraunces } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/features/auth/context/AuthContext"
import { SupplementCartProvider } from "@/features/supplements/context/supplements-cart-context"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
})

export const metadata: Metadata = {
  title: "1000Prep — Suplementos Deportivos de Calidad",
  description:
    "Suplementos deportivos seleccionados por nutricionistas. Proteínas, vitaminas, creatina y más. Envío incluido en pedidos mayores a $150.000.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${dmSans.variable} ${playfairDisplay.variable} ${fraunces.variable} font-sans antialiased`}>
        <AuthProvider>
          <SupplementCartProvider>
            {children}
          </SupplementCartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
