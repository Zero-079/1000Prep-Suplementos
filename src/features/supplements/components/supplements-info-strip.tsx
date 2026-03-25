// src/features/supplements/components/supplements-info-strip.tsx
"use client"

import { FlaskConical, Truck, UserCheck } from "lucide-react"

const INFO_ITEMS = [
  {
    icon: <FlaskConical className="size-8 text-primary" />,
    title: "Fórmulas verificadas",
    description: "Productos con respaldo científico y estudios clínicos.",
  },
  {
    icon: <Truck className="size-8 text-primary" />,
    title: "Envío incluido",
    description: "En pedidos mayores a $150.000.",
  },
  {
    icon: <UserCheck className="size-8 text-primary" />,
    title: "Recomendados por nutricionistas",
    description: "Cada producto pasa por un proceso de selección profesional.",
  },
]

export function SupplementsInfoStrip() {
  return (
    <div className="bg-card rounded-3xl border border-border shadow-md p-8 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
        {INFO_ITEMS.map((item) => (
          <div key={item.title} className="flex flex-col items-center text-center gap-3">
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              {item.icon}
            </div>
            <h3 className="font-serif text-lg font-bold text-foreground">{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
