// src/features/supplements/components/supplements-filter.tsx
"use client"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { FlaskConical, X } from "lucide-react"
import { SupplementCard } from "./supplement-card"
import type { Supplement, SupplementCategoryFilter } from "@/features/supplements/types/supplement"
import { cn } from "@/lib/utils"

interface FilterOption {
  label: string
  value: SupplementCategoryFilter
}

const FILTER_OPTIONS: FilterOption[] = [
  { label: "Todos",        value: "ALL" },
  { label: "Proteínas",    value: "PROTEIN" },
  { label: "Vitaminas",    value: "VITAMINS" },
  { label: "Creatina",     value: "CREATINE" },
  { label: "Pre-entreno",  value: "PRE_WORKOUT" },
  { label: "Quemadores de grasa", value: "FAT_BURNER" },
  { label: "Aminoácidos",  value: "AMINO_ACIDS" },
  { label: "Otros",        value: "OTHER" },
]

interface SupplementsFilterProps {
  supplements: Supplement[]
  isLoading: boolean
  error: string | null
  onOpenDetail: (supplement: Supplement) => void
}

function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-md animate-pulse">
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
  )
}

export function SupplementsFilter({
  supplements,
  isLoading,
  error,
  onOpenDetail,
}: SupplementsFilterProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get("category") as SupplementCategoryFilter | null
  const searchParam = searchParams.get("search")
  const initialFilter: SupplementCategoryFilter =
    categoryParam && FILTER_OPTIONS.some((f) => f.value === categoryParam)
      ? categoryParam
      : "ALL"

  const [activeFilter, setActiveFilter] = useState<SupplementCategoryFilter>(initialFilter)

  const filtered = useMemo(() => {
    let result = supplements

    // Filtrar por categoría
    if (activeFilter !== "ALL") {
      result = result.filter((s) => s.category === activeFilter)
    }

    // Filtrar por búsqueda de texto
    if (searchParam && searchParam.trim().length >= 2) {
      const searchTerm = searchParam.trim().toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm) ||
          s.description.toLowerCase().includes(searchTerm) ||
          s.brand.name.toLowerCase().includes(searchTerm)
      )
    }

    return result
  }, [supplements, activeFilter, searchParam])

  return (
    <div className="bg-card rounded-3xl border border-border shadow-md overflow-hidden">
      <div className="px-6 pt-6 pb-4 md:px-8 md:pt-8 md:pb-5 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FlaskConical className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Catálogo de <span className="text-primary">Suplementos</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              Seleccionados y verificados por nuestros nutricionistas
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                activeFilter === filter.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6 md:px-8 md:pb-8">
        {searchParam && (
          <div className="bg-muted/60 rounded-lg px-4 py-3 flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Resultados para: <span className="font-medium text-foreground">"{searchParam}"</span>
            </p>
            <button
              onClick={() => router.push("/catalogo")}
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Limpiar
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-destructive font-medium text-lg">Error al cargar los suplementos</p>
            <p className="text-muted-foreground text-sm mt-1">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            {searchParam ? (
              <>
                <p className="text-muted-foreground text-lg">
                  No se encontraron suplementos para "{searchParam}"
                </p>
                <button
                  onClick={() => router.push("/catalogo")}
                  className="mt-4 text-primary hover:text-primary/80 transition-colors"
                >
                  Ver todos los suplementos
                </button>
              </>
            ) : (
              <p className="text-lg font-medium text-muted-foreground">No hay suplementos en esta categoría</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((s) => (
              <SupplementCard key={s.id} supplement={s} onOpenDetail={onOpenDetail} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
