// src/components/benefits-strip.tsx
"use client"

import { CreditCard, Truck, Award } from "lucide-react"

const benefits = [
  { icon: CreditCard, title: "Pagos en línea" },
  { icon: Truck, title: "Envíos gratis" },
  { icon: Award, title: "Productos de alta calidad" },
]

export function BenefitsStrip() {
  return (
    <section className="bg-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 md:py-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-20 md:gap-32">
        {benefits.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-primary-foreground shrink-0" />
              <span className="text-sm font-medium text-primary-foreground">
                {item.title}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
