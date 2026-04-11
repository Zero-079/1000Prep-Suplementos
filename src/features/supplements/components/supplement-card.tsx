// src/features/supplements/components/supplement-card.tsx
"use client"

import { memo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, ArrowRight, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Supplement } from "@/features/supplements/types/supplement"
import { useSupplementCart } from "@/features/supplements/context/supplements-cart-context"
import { formatCOP } from "@/lib/utils"

interface SupplementCardProps {
  supplement: Supplement
  onOpenDetail: (supplement: Supplement) => void
  isSeller?: boolean
  onEdit?: (supplement: Supplement) => void
  onDelete?: (supplement: Supplement) => void
}

const CATEGORY_LABELS: Record<string, string> = {
  PROTEIN: "Proteínas",
  VITAMINS: "Vitaminas",
  CREATINE: "Creatina",
  PRE_WORKOUT: "Pre-entreno",
  FAT_BURNER: "Quemadores de grasa",
  AMINO_ACIDS: "Aminoácidos",
  OTHER: "Otros",
}

export const SupplementCard = memo(function SupplementCard({ 
  supplement, 
  onOpenDetail, 
  isSeller = false, 
  onEdit, 
  onDelete 
}: SupplementCardProps) {
  const { addItem } = useSupplementCart()

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(supplement)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(supplement)
  }

  // Mostrar la última imagen agregada (más reciente)
  const lastImage = supplement.images?.length 
    ? supplement.images[supplement.images.length - 1]?.url 
    : null
  const categoryLabel = CATEGORY_LABELS[supplement.category] ?? supplement.category

  return (
    <article
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => onOpenDetail(supplement)}
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {lastImage ? (
          <Image
            src={lastImage}
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
          {isSeller ? (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
                onClick={handleEdit}
              >
                <Pencil className="size-4" />
                <span className="sr-only sm:not-sr-only">Editar</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="size-4" />
                <span className="sr-only sm:not-sr-only">Eliminar</span>
              </Button>
            </div>
          ) : (
            <>
              <span className="text-lg font-bold text-primary leading-none">
                {formatCOP(supplement.price)}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-primary hover:bg-primary/10 px-2"
                  asChild
                >
                  <Link href={`/catalogo/${supplement.id}`}>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
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
            </>
          )}
        </div>
      </div>
    </article>
  )
})
