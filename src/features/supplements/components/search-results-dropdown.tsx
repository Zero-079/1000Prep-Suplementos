// src/features/supplements/components/search-results-dropdown.tsx
"use client"

import Image from "next/image"
import { SearchX } from "lucide-react"
import { cn, formatCOP } from "@/lib/utils"
import type { Supplement } from "../types/supplement"

interface SearchResultsDropdownProps {
  results: Supplement[]
  isLoading: boolean
  query: string
  onSelect: (supplement: Supplement) => void
  onViewAll: () => void
  className?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  PROTEIN: "Proteínas",
  VITAMINS: "Vitaminas",
  CREATINE: "Creatina",
  PRE_WORKOUT: "Pre-entreno",
  FAT_BURNER: "Quemadores",
  AMINO_ACIDS: "Aminoácidos",
  OTHER: "Otros",
}

function SkeletonItem() {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
      </div>
    </div>
  )
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <SearchX className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">
        No encontramos <span className="font-medium text-foreground">"{query}"</span>
      </p>
    </div>
  )
}

function ResultItem({
  supplement,
  onClick,
}: {
  supplement: Supplement
  onClick: () => void
}) {
  const firstImage = supplement.images?.[0]?.url ?? null
  const categoryLabel = CATEGORY_LABELS[supplement.category] ?? supplement.category

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 
                 hover:bg-muted/60 transition-colors cursor-pointer 
                 text-left"
    >
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-border/40">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={supplement.name}
            width={40}
            height={40}
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-lg">🧪</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground truncate">
          {supplement.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-primary font-semibold text-sm">
            {formatCOP(supplement.price)}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
            {categoryLabel}
          </span>
        </div>
      </div>
    </button>
  )
}

export function SearchResultsDropdown({
  results,
  isLoading,
  query,
  onSelect,
  onViewAll,
  className,
}: SearchResultsDropdownProps) {
  // No renderizar si no hay query
  if (!query || query.trim().length < 2) return null

  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 mt-1 z-50",
        "bg-background border border-border/60 rounded-xl shadow-xl",
        "max-h-80 overflow-y-auto",
        "animate-in fade-in slide-in-from-top-2 duration-200",
        className
      )}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="py-1">
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </div>
      )}

      {/* No results */}
      {!isLoading && results.length === 0 && <NoResults query={query} />}

      {/* Results */}
      {!isLoading && results.length > 0 && (
        <>
          <div className="py-1">
            {results.map((supplement) => (
              <ResultItem
                key={supplement.id}
                supplement={supplement}
                onClick={() => onSelect(supplement)}
              />
            ))}
          </div>
          <button
            onClick={onViewAll}
            className="w-full px-3 py-2 text-sm text-primary font-medium 
                       border-t border-border/40 hover:bg-muted/40 
                       transition-colors text-left flex items-center justify-between"
          >
            <span>Ver todos los resultados</span>
            <span className="text-xs">→</span>
          </button>
        </>
      )}
    </div>
  )
}
