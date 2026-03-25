// src/features/supplements/components/supplements-hero.tsx
"use client"

export function SupplementsHero() {
  return (
    <section className="pt-32 pb-6 md:pt-40 md:pb-8 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
          Nuestros <span className="text-primary">Suplementos</span>
        </h1>
        <p className="mt-3 text-muted-foreground text-lg max-w-2xl">
          Complementa tu alimentación con suplementos de calidad, seleccionados
          por nuestros nutricionistas.
        </p>
      </div>
    </section>
  )
}
