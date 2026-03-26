// src/components/coming-soon-banner.tsx
"use client"

import Image from "next/image"

export function ComingSoonBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-background min-h-[280px] md:min-h-[340px]">
      {/* Image — right side, edge to edge of screen */}
      <div className="absolute right-0 top-0 bottom-0 w-3/5">
        <Image
          src="/1000prep-section-image.jpg"
          alt="Producto 1000Prep empacado"
          fill
          className="object-cover object-center"
          sizes="60vw"
          priority
        />
        {/* Gradient: white fades into the image — no hard line */}
        <div className="absolute inset-0 w-54 bg-gradient-to-r from-background via-background/40 to-transparent" />
      </div>

      {/* Text content — left side, constrained to max-w-7xl */}
      <div className="relative z-10 max-w-7xl mx-auto h-full">
        <div className="flex items-center min-h-[280px] md:min-h-[340px]">
          <div className="px-8 md:px-12 lg:px-16 py-12 md:py-16 max-w-[500px]">
            <p className="font-serif text-lg md:text-xl text-muted-foreground italic mb-3 tracking-wide">
              ¡Próximamente...
            </p>
            <h2 className="flex items-baseline gap-2 flex-wrap">
              <span className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary">
                1000
              </span>
              <span className="font-serif text-5xl md:text-6xl lg:text-7xl italic" style={{ color: '#D5BC84' }}>
                Prep!
              </span>
            </h2>
            <div className="mt-6 h-[2px] w-20 bg-primary/30 rounded-full" />
            <p className="mt-4 font-sans text-sm md:text-base text-muted-foreground max-w-xs">
              Algo grande viene en camino. Mantente atento.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
