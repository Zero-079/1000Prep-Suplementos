// src/app/page.tsx
"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { TopCategories } from "@/components/top-categories"
import { BestSellers } from "@/components/best-sellers"
import { BenefitsStrip } from "@/components/benefits-strip"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <TopCategories />
      <BestSellers />
      <BenefitsStrip />
      <Footer />
    </div>
  )
}
