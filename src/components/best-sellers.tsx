// src/components/best-sellers.tsx
"use client"

import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  name: string
  price: string
}

const products: Product[] = [
  { name: "Whey Protein Isolate 900g", price: "$189.900" },
  { name: "Creatina Monohidrato 300g", price: "$64.900" },
  { name: "Pre-entreno C4 60 serv", price: "$129.900" },
  { name: "BCAA 2:1:1 300g", price: "$79.900" },
  { name: "Multivitamínico Hombre", price: "$49.900" },
  { name: "Quemador L-Carnitina", price: "$59.900" },
  { name: "Proteína Vegana 900g", price: "$169.900" },
  { name: "Glutamina 500g", price: "$74.900" },
]

export function BestSellers() {
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
          {products.map((product) => (
            <article
              key={product.name}
              className="group bg-card rounded-2xl border border-border/60 overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              {/* Image placeholder */}
              <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full border border-foreground/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[11px] text-muted-foreground/40 font-medium">400 × 400</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 md:p-4 flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-base md:text-lg font-bold text-primary leading-none">
                    {product.price}
                  </span>
                  <Button
                    size="sm"
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-1 h-8 px-3"
                  >
                    <Plus className="size-3.5" />
                    <span className="text-xs">Agregar</span>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
