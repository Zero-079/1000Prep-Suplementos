// src/components/top-categories.tsx
"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface Category {
  name: string
}

const categories: Category[] = [
  { name: "Proteínas" },
  { name: "Vitaminas" },
  { name: "Creatina" },
  { name: "Pre-entreno" },
  { name: "Quemadores de grasa" },
  { name: "Aminoácidos" },
]

export function TopCategories() {
  return (
    <section className="px-6 lg:px-8 pt-16 md:pt-20 pb-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Top <span className="text-primary">categorías</span>
          </h2>
          <Link
            href="/catalogo"
            className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver todas
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Cards — scroll on mobile, grid on desktop */}
        <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-6 md:overflow-visible scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href="/catalogo"
              className="group flex-none w-[130px] md:w-auto rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              {/* Image placeholder */}
              <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full border border-foreground/5" />
                <div className="absolute bottom-4 left-3 w-5 h-5 rounded-full bg-foreground/[0.03]" />

                {/* Label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground/40 font-medium">400 × 400</p>
                </div>
              </div>

              {/* Category name */}
              <div className="px-3 py-3">
                <span className="text-sm font-medium text-foreground text-center block leading-tight">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
