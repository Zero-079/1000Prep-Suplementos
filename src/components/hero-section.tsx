// src/components/hero-section.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[92vh] md:min-h-screen flex items-end pb-16 md:pb-20 overflow-hidden">
      {/* Background image */}
      <Image
        src="/hero-image.png"
        alt=""
        fill
        priority
        className="object-cover -z-10"
        sizes="100vw"
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto w-full px-6 lg:px-8 py-32 md:py-0">
        <div className="max-w-xl space-y-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
            <Leaf className="w-4 h-4" />
            Suplementos de calidad
          </div>

          {/* Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.08] tracking-tight">
            Alimenta tu
            <br />
            máximo{" "}
            <span className="text-primary relative">
              potencial
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-primary/20"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8C30 2 70 2 100 6C130 10 170 10 198 4"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vitae de calidad
            seleccionados por nuestros nutricionistas para potenciar tu rendimiento.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-13 text-base font-semibold group"
              asChild
            >
              <Link href="/catalogo">
                Ver catálogo
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button> 
          </div>
        </div>
      </div>
    </section>
  )
}
