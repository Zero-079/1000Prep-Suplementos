// src/components/hero-section.tsx
"use client"

import Link from "next/link"
import { ArrowRight, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] md:min-h-screen flex items-center overflow-hidden">
      {/* Background — layered gradient mesh */}
      <div className="absolute inset-0 -z-10">
        {/* Base warm tone */}
        <div className="absolute inset-0 bg-background" />

        {/* Green mesh blobs */}
        <div
          className="absolute top-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.07] blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.52 0.14 145), transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-20%] left-[-15%] w-[50vw] h-[50vw] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.12 50), transparent 70%)" }}
        />
        <div
          className="absolute top-[30%] left-[20%] w-[30vw] h-[30vw] rounded-full opacity-[0.04] blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.62 0.14 145), transparent 70%)" }}
        />

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.15 0.01 60) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 py-32 md:py-0">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left Column — 60% (3/5) */}
          <div className="lg:col-span-3 space-y-8">
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

            {/* CTA row */}
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

          {/* Right Column — 40% (2/5) — Image placeholder */}
          <div className="hidden lg:flex lg:col-span-2 justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden">
              {/* Gradient placeholder background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-secondary/10" />

              {/* Decorative circles */}
              <div className="absolute top-8 right-8 w-24 h-24 rounded-full border-2 border-primary/20" />
              <div className="absolute bottom-12 left-8 w-16 h-16 rounded-full bg-primary/10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-primary/15" />

              {/* Center content — placeholder label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center">
                  <Leaf className="w-10 h-10 text-primary/40" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-muted-foreground/60">Imagen del producto</p>
                  <p className="text-xs text-muted-foreground/40">800 × 1000px</p>
                </div>
              </div>

              {/* Subtle inner border */}
              <div className="absolute inset-3 rounded-2xl border border-foreground/5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to content */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
    </section>
  )
}
