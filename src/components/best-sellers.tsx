// src/components/best-sellers.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSupplements } from "@/features/supplements/hooks/useSupplements"
import { useSupplementCart } from "@/features/supplements/context/supplements-cart-context"
import { formatCOP } from "@/lib/utils"

const CATEGORY_LABELS: Record<string, string> = {
  PROTEIN: "Proteínas",
  VITAMINS: "Vitaminas",
  CREATINE: "Creatina",
  PRE_WORKOUT: "Pre-entreno",
  FAT_BURNER: "Quemadores de grasa",
  AMINO_ACIDS: "Aminoácidos",
  OTHER: "Otros",
}

function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-md animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 flex flex-col gap-3">
        <div>
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2 mt-1" />
          <div className="h-3 bg-muted rounded w-full mt-2" />
          <div className="h-3 bg-muted rounded w-full mt-1" />
        </div>
        <div className="flex justify-between pt-2 border-t border-border/50">
          <div className="h-5 bg-muted rounded w-1/3" />
          <div className="h-8 bg-muted rounded-full w-20" />
        </div>
      </div>
    </div>
  )
}

export function BestSellers() {
  const { supplements, isLoading, error } = useSupplements()
  const { addItem } = useSupplementCart()

  const bestSellers = supplements.slice(0, 8)

  return (
    <section className="px-6 lg:px-8 py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Lo más <span className="text-primary">comprado</span>
          </h2>
          <Link
            href="/catalogo"
            className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver más
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : error
              ? (
                <div className="col-span-full py-16 text-center">
                  <p className="text-destructive font-medium text-lg">Error al cargar los productos</p>
                  <p className="text-muted-foreground text-sm mt-1">{error}</p>
                </div>
              )
              : bestSellers.map((supplement) => {
                  const firstImage = supplement.images?.[0]?.url ?? null
                  const categoryLabel = CATEGORY_LABELS[supplement.category] ?? supplement.category

                  return (
                    <article
                      key={supplement.id}
                      className="group bg-card rounded-2xl border border-border overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-white">
                        {firstImage ? (
                          <Image
                            src={firstImage}
                            alt={supplement.name}
                            fill
                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            loading="eager"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-5xl">🧪</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-card/90 text-foreground backdrop-blur-sm text-[11px] font-medium border-0 shadow-sm">
                            {categoryLabel}
                          </Badge>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 flex flex-col gap-3 flex-1">
                        <div>
                          <h3 className="font-semibold text-foreground text-base leading-snug line-clamp-2 min-h-[2.75rem]">
                            {supplement.name}
                          </h3>
                          <p className="text-primary text-xs font-medium mt-0.5">
                            {supplement.brand.name}
                          </p>
                          <p className="text-muted-foreground text-sm mt-1 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                            {supplement.description}
                          </p>
                        </div>

                        {supplement.servingSize && (
                          <span className="bg-primary/10 text-primary text-[11px] px-2.5 py-1 rounded-full font-medium w-fit">
                            {supplement.servingSize}
                          </span>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-auto">
                          <span className="text-lg font-bold text-primary leading-none">
                            {formatCOP(supplement.price)}
                          </span>
                          <Button
                            size="sm"
                            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              addItem(supplement)
                            }}
                          >
                            <Plus className="size-4" />
                            <span className="sr-only sm:not-sr-only">Agregar</span>
                          </Button>
                        </div>
                      </div>
                    </article>
                  )
                })}
        </div>
      </div>
    </section>
  )
}
