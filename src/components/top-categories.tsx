// src/components/top-categories.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface Category {
  name: string
  image: string
}

const categories: Category[] = [
  { name: "Proteínas", image: "https://res.cloudinary.com/dizwnyqfy/image/upload/v1773420526/71f_UBXh2vL._AC_UF1000_1000_QL80__ilpygy.jpg" },
  { name: "Vitaminas", image: "https://res.cloudinary.com/dizwnyqfy/image/upload/v1774366656/125559-en-US-690px-01_tcjchc.png" },
  { name: "Creatina", image: "https://res.cloudinary.com/dizwnyqfy/image/upload/v1774366799/muscletech-int-platinum-100-creatine-monohydrate_kkq97k.png" },
  { name: "Pre-entreno", image: "https://res.cloudinary.com/dizwnyqfy/image/upload/v1774366738/intenze-fruit-punch_vxehwa.jpg" },
  { name: "Quemadores de grasa", image: "https://res.cloudinary.com/dizwnyqfy/image/upload/v1774372880/71SxaYftr-L._AC_UF1000_1000_QL80__yu8s1n.jpg" },
  { name: "Aminoácidos", image: "https://res.cloudinary.com/dizwnyqfy/image/upload/v1773419791/71_R-I6pUjL._AC_UF894_1000_QL80__aoqbx7.jpg" },
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
              {/* Image */}
              <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 130px, 16vw"
                  unoptimized
                />
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
