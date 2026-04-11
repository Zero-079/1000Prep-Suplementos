// src/components/home-content.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { TopCategories } from "@/components/top-categories"
import { BestSellers } from "@/components/best-sellers"
import { BenefitsStrip } from "@/components/benefits-strip"
import { ComingSoonBanner } from "@/components/coming-soon-banner"
import { Footer } from "@/components/footer"
import { useAuthContext } from "@/features/auth/context/AuthContext"

export function HomeContent() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuthContext()

  // Redirigir vendedores a /catalogo
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === "SELLER") {
      router.replace("/catalogo")
    }
  }, [isLoading, isAuthenticated, user, router])

  // No mostrar contenido mientras se verifica auth para vendedores
  if (!isLoading && isAuthenticated && user?.role === "SELLER") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <TopCategories />
      <BestSellers />
      <BenefitsStrip />
      <ComingSoonBanner />
      <Footer />
    </div>
  )
}