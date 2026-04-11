// src/app/catalogo/page.tsx
"use client"

import { useState, Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SupplementsFilter } from "@/features/supplements/components/supplements-filter"
import { SupplementDetailModal } from "@/features/supplements/components/supplement-detail-modal"
import { SupplementsInfoStrip } from "@/features/supplements/components/supplements-info-strip"
import { useSupplements } from "@/features/supplements/hooks/useSupplements"
import { useRestorePendingCart } from "@/features/supplements/hooks/useRestorePendingCart"
import type { Supplement } from "@/features/supplements/types/supplement"

// Skeleton para el filtro cuando está cargando
function FilterSkeleton() {
  return (
    <div className="bg-card rounded-3xl border border-border shadow-md overflow-hidden">
      <div className="px-6 pt-6 pb-4 md:px-8 md:pt-8 md:pb-5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-muted animate-pulse" />
          <div>
            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted rounded mt-2 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-10 w-20 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
      </div>
      <div className="px-6 pb-6 md:px-8 md:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden shadow-md animate-pulse">
              <div className="aspect-square bg-muted" />
              <div className="p-4 flex flex-col gap-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="flex justify-between pt-2 border-t border-border/50">
                  <div className="h-5 bg-muted rounded w-1/3" />
                  <div className="h-8 bg-muted rounded-full w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CatalogoPage() {
  const { supplements, isLoading, error, refetch } = useSupplements()
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
          {/* Suspense con skeleton específico para filtros */}
          <Suspense fallback={<FilterSkeleton />}>
            <SupplementsFilter
              supplements={supplements}
              isLoading={isLoading}
              error={error}
              onOpenDetail={openDetail}
              refetch={refetch}
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

      <Footer />
    </div>
  )
}
