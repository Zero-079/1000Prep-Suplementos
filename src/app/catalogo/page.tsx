// src/app/catalogo/page.tsx
"use client"

import { useState, Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SupplementsFilter } from "@/features/supplements/components/supplements-filter"
import { SupplementDetailModal } from "@/features/supplements/components/supplement-detail-modal"
import { SupplementsMiniCart } from "@/features/supplements/components/supplements-mini-cart"
import { SupplementsInfoStrip } from "@/features/supplements/components/supplements-info-strip"
import { useSupplements } from "@/features/supplements/hooks/useSupplements"
import { useRestorePendingCart } from "@/features/supplements/hooks/useRestorePendingCart"
import type { Supplement } from "@/features/supplements/types/supplement"

export default function CatalogoPage() {
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

      {/* Hero interno del catálogo */}
      <section className="pt-32 pb-6 md:pt-40 md:pb-8 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
            Nuestros <span className="text-primary">Suplementos</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
            Complementa tu alimentación con suplementos de calidad, seleccionados
            por nuestros nutricionistas.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-8 pb-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <Suspense fallback={null}>
            <SupplementsFilter
              supplements={supplements}
              isLoading={isLoading}
              error={error}
              onOpenDetail={openDetail}
            />
          </Suspense>
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
