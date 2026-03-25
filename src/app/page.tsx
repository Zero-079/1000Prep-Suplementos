// src/app/page.tsx
"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SupplementCartProvider } from "@/features/supplements/context/supplements-cart-context"
import { SupplementsHero } from "@/features/supplements/components/supplements-hero"
import { SupplementsFilter } from "@/features/supplements/components/supplements-filter"
import { SupplementDetailModal } from "@/features/supplements/components/supplement-detail-modal"
import { SupplementsMiniCart } from "@/features/supplements/components/supplements-mini-cart"
import { SupplementsInfoStrip } from "@/features/supplements/components/supplements-info-strip"
import { useSupplements } from "@/features/supplements/hooks/useSupplements"
import { useRestorePendingCart } from "@/features/supplements/hooks/useRestorePendingCart"
import type { Supplement } from "@/features/supplements/types/supplement"

function SupplementsContent() {
  const { supplements, isLoading, error } = useSupplements()
  const [detailSupplement, setDetailSupplement] = useState<Supplement | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  useRestorePendingCart()

  const openDetail = (supplement: Supplement) => {
    setDetailSupplement(supplement)
    setDetailOpen(true)
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Header />

      <SupplementsHero />

      <section className="px-6 lg:px-8 py-8 pb-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <SupplementsFilter
            supplements={supplements}
            isLoading={isLoading}
            error={error}
            onOpenDetail={openDetail}
          />
          <SupplementsInfoStrip />
        </div>
      </section>

      <SupplementDetailModal
        supplement={detailSupplement}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <SupplementsMiniCart />
      <Footer />
    </div>
  )
}

export default function Home() {
  return (
    <SupplementCartProvider>
      <SupplementsContent />
    </SupplementCartProvider>
  )
}
