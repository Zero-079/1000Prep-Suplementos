// src/features/supplements/components/supplement-detail-content.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Minus, Plus, Star, Leaf, Shield, Zap, Info, Utensils, MoreHorizontal } from "lucide-react"
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
  const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'more'>('details')
  const contentRef = useRef<HTMLDivElement>(null)

  const firstImage = supplement.images?.[0]?.url ?? null
  const categoryLabel = CATEGORY_LABELS[supplement.category] ?? supplement.category
  const categoryIcon = CATEGORY_ICONS[supplement.category] ?? "🧪"
  const nutrition = supplement.nutrition
  const inStock = supplement.stock && supplement.stock > 0

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
      {/* Fixed header: Image + Purchase panel */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:gap-12 mb-6 lg:mb-8 relative">
        {/* Decorative background elements - subtle natural feel */}
        <div className="absolute -inset-4 -z-10 rounded-3xl opacity-50" 
          style={{
            background: `radial-gradient(ellipse at 20% 0%, oklch(0.52 0.14 145) 0%, transparent 50%),
                        radial-gradient(ellipse at 80% 100%, oklch(0.94 0.005 80) 0%, transparent 50%)`
          }} 
        />
        {/* LEFT COLUMN - Image with premium presentation */}
        <div className="relative mb-6 lg:mb-0">
          {/* Main product image container - smaller size */}
          <div className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-white border border-border">
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
          </div>

          {/* Decorative frame accent - organic shape */}
          <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -top-3 -right-3 w-16 h-16 bg-muted/40 rounded-full blur-xl" />
        </div>

        {/* RIGHT COLUMN - Content - centered vertically */}
        <div className="flex flex-col gap-6 lg:h-full lg:justify-center">
          {/* Main info section - scrolls with page */}
          <div>
            <div className="bg-muted/80 lg:bg-muted dark:bg-card/80 lg:dark:bg-card backdrop-blur-sm lg:backdrop-blur-none rounded-2xl p-5 lg:p-6 border border-border lg:shadow-lg lg:shadow-primary/5 space-y-5">
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
                <h1 className="font-display text-3xl sm:text-4xl lg:text-4xl font-bold text-foreground leading-[1.1] tracking-tight">
                  {supplement.name}
                </h1>

                {/* Price & Stock - prominent display */}
                <div className="flex items-center gap-4">
                  <p className="text-3xl font-display font-bold text-foreground">
                    {formatCOP(supplement.price)}
                  </p>
                  {supplement.stock && supplement.stock > 0 ? (
                    <span className="text-sm font-medium text-muted-foreground">
                      {supplement.stock} disponibles
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground opacity-50">
                      Sin stock
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity & Add to Cart - only if showQuantitySelector */}
              {showQuantitySelector && (
                <div className="space-y-4 pt-2">
                  {/* Quantity selector - refined styling */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Cantidad
                    </span>
                    <div className="flex items-center gap-1 ml-auto">
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
                  </div>

                  {/* Add to cart button - prominent CTA */}
                  <Button
                    className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-semibold shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    size="lg"
                    onClick={handleAdd}
                    disabled={!inStock}
                  >
                    
                    - Agregar al Carrito -
                  </Button>
                </div>
              )}

              {/* Trust elements */}
              <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>100% Original</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-primary" />
                  <span>Garantía</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - Horizontal */}
      <div className="border-b border-border mb-6">
        <nav className="flex gap-1">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === 'details'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
            }`}
          >
            <Info className="w-4 h-4" />
            Detalles
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === 'nutrition'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Nutrición
          </button>
        </nav>
      </div>

      {/* Tab Content - Scrollable */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Descripción
                </h3>
              </div>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed ml-4">
                {supplement.description}
              </p>
            </div>

            <Separator className="bg-border/50" />

            {/* Usage Instructions - same style as Description */}
            {(supplement.usageInstructions || supplement.servingSize) && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Modo de uso
                  </h3>
                </div>
                {supplement.servingSize && (
                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed ml-4">
                    Porción: <span className="text-foreground font-semibold">{supplement.servingSize}</span>
                  </p>
                )}
                {supplement.usageInstructions && (
                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed ml-4">
                    {supplement.usageInstructions}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h3 className="font-display text-xl font-semibold text-foreground">
                Información Nutricional
              </h3>
            </div>
            
            {nutrition ? (
              <>
                <p className="text-xs text-muted-foreground ml-4">
                  Por porción ({supplement.servingSize}) · {nutrition.servingsPerContainer} porciones por envase
                </p>
                
                <div className="bg-background dark:bg-card rounded-xl overflow-hidden border border-border shadow-lg shadow-primary/5">
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
              </>
            ) : (
              <div className="bg-muted/30 rounded-xl p-8 text-center border border-border/50">
                <p className="text-muted-foreground">No hay información nutricional disponible</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'more' && (
          <div className="space-y-6">
            {/* Brand Info */}
            <div className="bg-muted/50 rounded-2xl p-5 border border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Marca
                </h3>
              </div>
              <div className="ml-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {supplement.brand.logoUrl ? (
                    <Image 
                      src={supplement.brand.logoUrl} 
                      alt={supplement.brand.name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-2xl">🏷️</span>
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {supplement.brand.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-muted/50 rounded-2xl p-5 border border-border/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Información Adicional
                </h3>
              </div>
              
              <div className="ml-4 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Categoría</span>
                  <span className="text-sm font-medium text-foreground">{categoryLabel}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Porción recomendada</span>
                  <span className="text-sm font-medium text-foreground">{supplement.servingSize || 'No especificada'}</span>
                </div>
                {nutrition && (
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-sm text-muted-foreground">Porciones por envase</span>
                    <span className="text-sm font-medium text-foreground">{nutrition.servingsPerContainer}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}