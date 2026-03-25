// src/features/supplements/components/supplement-detail-modal.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Supplement } from "@/features/supplements/types/supplement"
import { useSupplementCart } from "@/features/supplements/context/supplements-cart-context"
import { formatCOP } from "@/lib/utils"

interface SupplementDetailModalProps {
  supplement: Supplement | null
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function SupplementDetailModal({
  supplement,
  open,
  onOpenChange,
}: SupplementDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useSupplementCart()

  if (!supplement) return null

  const firstImage = supplement.images?.[0]?.url ?? null
  const categoryLabel = CATEGORY_LABELS[supplement.category] ?? supplement.category
  const nutrition = supplement.nutrition

  const handleAdd = () => {
    addItem(supplement, quantity)
    setQuantity(1)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl">
        <div className="relative w-full aspect-square sm:aspect-video overflow-hidden rounded-t-2xl bg-white">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={supplement.name}
              fill
              className="object-contain p-8"
              sizes="(max-width: 640px) 100vw, 672px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-7xl">🧪</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge className="bg-card/90 text-foreground backdrop-blur-sm text-xs font-medium border-0 shadow-sm">
              {categoryLabel}
            </Badge>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <DialogHeader className="text-left gap-1">
            <p className="text-primary text-sm font-medium">{supplement.brand.name}</p>
            <DialogTitle className="font-serif text-2xl font-bold text-foreground">
              {supplement.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base leading-relaxed">
              {supplement.description}
            </DialogDescription>
          </DialogHeader>

          {(supplement.usageInstructions || supplement.servingSize) && (
            <div className="flex flex-col gap-2">
              {supplement.servingSize && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Porción
                  </span>
                  <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                    {supplement.servingSize}
                  </span>
                </div>
              )}
              {supplement.usageInstructions && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Modo de uso: </span>
                  {supplement.usageInstructions}
                </p>
              )}
            </div>
          )}

          <Separator />

          {nutrition && (
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">
                Información Nutricional
              </h4>
              <p className="text-[11px] text-muted-foreground mb-3">
                Por porción ({supplement.servingSize}) · {nutrition.servingsPerContainer} porciones por envase
              </p>
              <div className="bg-muted/50 rounded-xl overflow-hidden border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Nutriente
                      </th>
                      <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Por porción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-2 text-foreground">Calorías</td>
                      <td className="px-4 py-2 text-right text-muted-foreground">{nutrition.calories} kcal</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-foreground">Proteínas</td>
                      <td className="px-4 py-2 text-right text-muted-foreground">{nutrition.protein} g</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-foreground">Carbohidratos</td>
                      <td className="px-4 py-2 text-right text-muted-foreground">{nutrition.carbs} g</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-foreground">Grasas totales</td>
                      <td className="px-4 py-2 text-right text-muted-foreground">{nutrition.fat} g</td>
                    </tr>
                    {Object.entries(nutrition.otherNutrients ?? {}).map(([key, val]) => (
                      <tr key={key}>
                        <td className="px-4 py-2 text-foreground capitalize">{key.replace(/_/g, " ")}</td>
                        <td className="px-4 py-2 text-right text-muted-foreground">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon-sm" className="rounded-full"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Disminuir cantidad">
                <Minus className="size-4" />
              </Button>
              <span className="w-10 text-center text-base font-semibold tabular-nums">{quantity}</span>
              <Button variant="outline" size="icon-sm" className="rounded-full"
                onClick={() => setQuantity((q) => q + 1)} aria-label="Aumentar cantidad">
                <Plus className="size-4" />
              </Button>
            </div>
            <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 text-base" size="lg" onClick={handleAdd}>
              Agregar al Carrito — {formatCOP(supplement.price)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
