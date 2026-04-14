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
import { useRoles } from "@/features/auth/hooks/usePermission"

export function HomeContent() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuthContext()
  const { hasPermission: isSeller, isLoading: isRoleLoading } = useRoles(['SELLER'])

  // Combinar loading states
  const isChecking = isLoading || isRoleLoading

  // Redirigir vendedores a /catalogo
  useEffect(() => {
    if (!isChecking && isAuthenticated && isSeller) {
      router.replace("/catalogo")
    }
  }, [isChecking, isAuthenticated, isSeller, router])

  // No mostrar contenido mientras se verifica auth para vendedores
  if (!isChecking && isAuthenticated && isSeller) {
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