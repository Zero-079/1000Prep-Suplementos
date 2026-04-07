// src/features/supplements/components/supplement-detail-content.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Minus, Plus, Star, Leaf, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Supplement } from "@/features/supplements/types/supplement"
import { formatCOP } from "@/lib/utils"

interface SupplementDetailContentProps {
  supplement: Supplement
  showQuantitySelector?: boolean
  onAddToCart?: (quantity: number) => void
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

const CATEGORY_ICONS: Record<string, string> = {
  PROTEIN: "💪",
  VITAMINS: "💊",
  CREATINE: "⚡",
  PRE_WORKOUT: "🔥",
  FAT_BURNER: "🌿",
  AMINO_ACIDS: "🔬",
  OTHER: "🧪",
}

export function SupplementDetailContent({
  supplement,
  showQuantitySelector = true,
  onAddToCart,
}: SupplementDetailContentProps) {
  const [quantity, setQuantity] = useState(1)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const firstImage = supplement.images?.[0]?.url ?? null
  const categoryLabel = CATEGORY_LABELS[supplement.category] ?? supplement.category
  const categoryIcon = CATEGORY_ICONS[supplement.category] ?? "🧪"
  const nutrition = supplement.nutrition

  // Entry animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(quantity)
      setQuantity(1)
    }
  }

  return (
    <div 
      ref={contentRef}
      className={`relative transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Decorative background elements - subtle natural feel */}
      <div className="absolute -inset-4 -z-10 rounded-3xl opacity-50" 
        style={{
          background: `radial-gradient(ellipse at 20% 0%, oklch(0.52 0.14 145) 0%, transparent 50%),
                       radial-gradient(ellipse at 80% 100%, oklch(0.94 0.005 80) 0%, transparent 50%)`
        }} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* LEFT COLUMN - Image with premium presentation */}
        <div className="relative">
          {/* Main product image container */}
          <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl lg:rounded-3xl overflow-hidden bg-white border border-border">
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
              }} 
            />
            
            {firstImage ? (
              <div className={`relative w-full h-full p-6 transition-all duration-700 ${
                isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}>
                <Image
                  src={firstImage}
                  alt={supplement.name}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onLoad={() => setIsImageLoaded(true)}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl">{categoryIcon}</span>
              </div>
            )}
            
            {/* Floating category badge - premium feel */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-muted/95 text-muted-foreground backdrop-blur-md shadow-lg border border-primary/20 px-3 py-1.5">
                <Leaf className="w-3 h-3 mr-1.5 text-primary" />
                {categoryLabel}
              </Badge>
            </div>

            {/* Trust badges - floating bottom right */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <div className="bg-background/90 dark:bg-card/90 backdrop-blur-sm rounded-full p-2 shadow-lg" title="Producto verificado">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-background/90 dark:bg-card/90 backdrop-blur-sm rounded-full p-2 shadow-lg" title="Envío seguro">
                <Zap className="w-4 h-4 text-accent" />
            </div>
          </div>

          {/* Decorative frame accent - organic shape */}
          <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -top-3 -right-3 w-16 h-16 bg-muted/40 rounded-full blur-xl" />
        </div>
        </div>

        {/* RIGHT COLUMN - Content */}
        <div className="flex flex-col gap-6 lg:gap-8">
          {/* Brand & Title */}
          <div className="space-y-3">
            {/* Brand with premium styling */}
            <div className="inline-flex items-center gap-2">
              <div className="h-px w-8 bg-primary" />
              <span className="text-sm font-semibold tracking-widest uppercase text-primary/80 dark:text-primary/60">
                {supplement.brand.name}
              </span>
            </div>
            
            {/* Product name - Fraunces for editorial feel */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
              {supplement.name}
            </h1>

            {/* Description with refined typography */}
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl">
              {supplement.description}
            </p>
          </div>

          {/* Usage Instructions - Card style */}
          {(supplement.usageInstructions || supplement.servingSize) && (
            <div className="bg-muted rounded-2xl p-5 border border-border/50">
              {supplement.servingSize && (
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg">🥄</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Porción recomendada
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {supplement.servingSize}
                    </p>
                  </div>
                </div>
              )}
              {supplement.usageInstructions && (
                <div className="pl-13">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Modo de uso: </span>
                    {supplement.usageInstructions}
                  </p>
                </div>
              )}
            </div>
          )}

          <Separator className="bg-border/50" />

          {/* Nutrition Information - Editorial table style */}
          {nutrition && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Información Nutricional
                </h3>
              </div>
              
              <p className="text-xs text-muted-foreground ml-4">
                Por porción ({supplement.servingSize}) · {nutrition.servingsPerContainer} porciones por envase
              </p>
              
              <div className="bg-background dark:bg-card rounded-xl overflow-hidden border border-border shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted border-b border-border">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Nutriente
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Por porción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted">
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-3 text-foreground font-medium">Calorías</td>
                      <td className="px-5 py-3 text-right text-muted-foreground">{nutrition.calories} kcal</td>
                    </tr>
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-3 text-foreground font-medium">Proteínas</td>
                      <td className="px-5 py-3 text-right text-muted-foreground">{nutrition.protein} g</td>
                    </tr>
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-3 text-foreground font-medium">Carbohidratos</td>
                      <td className="px-5 py-3 text-right text-muted-foreground">{nutrition.carbs} g</td>
                    </tr>
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-3 text-foreground font-medium">Grasas totales</td>
                      <td className="px-5 py-3 text-right text-muted-foreground">{nutrition.fat} g</td>
                    </tr>
                    {Object.entries(nutrition.otherNutrients ?? {}).map(([key, val]) => (
                      <tr key={key} className="hover:bg-muted/50 transition-colors">
                        <td className="px-5 py-3 text-foreground font-medium capitalize">
                          {key.replace(/_/g, " ")}
                        </td>
                        <td className="px-5 py-3 text-right text-muted-foreground">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Price & Add to Cart */}
          {showQuantitySelector && (
            <>
              <Separator className="bg-border/50" />
              
              <div className="bg-muted dark:bg-card rounded-2xl p-6 border border-border shadow-lg shadow-primary/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Quantity selector - refined styling */}
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-muted-foreground mr-2">
                      Cantidad
                    </span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className="rounded-full border-border text-foreground hover:bg-muted hover:border-primary transition-all"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="w-12 text-center text-xl font-display font-bold text-foreground tabular-nums">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className="rounded-full border-border text-foreground hover:bg-muted hover:border-primary transition-all"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>

                  {/* Add to cart button - prominent CTA */}
                  <Button
                    className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    size="lg"
                    onClick={handleAdd}
                  >
                    Agregar al Carrito — {formatCOP(supplement.price)}
                  </Button>
                </div>
              </div>
            </>
          )}

          {!showQuantitySelector && (
            <div className="mt-2">
              <p className="text-4xl font-display font-bold text-foreground">
                {formatCOP(supplement.price)}
              </p>
            </div>
          )}

          {/* Footer trust elements */}
          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-primary" />
              <span>100% Original</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-primary" />
              <span>Garantía de calidad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}