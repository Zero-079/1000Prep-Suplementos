// src/app/catalogo/[id]/not-found.tsx
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center px-6">
      <div className="text-center py-12 max-w-md">
        <div className="text-8xl mb-4">🔍</div>
        <h2 className="text-3xl font-bold text-foreground mb-3">
          Producto no encontrado
        </h2>
        <p className="text-muted-foreground mb-8">
          El producto que buscas no existe, ha sido eliminado o el enlace es incorrecto.
        </p>
        <Button onClick={() => router.push("/catalogo")} size="lg">
          <ArrowLeft className="size-4 mr-2" />
          Volver al catálogo
        </Button>
      </div>
    </div>
  )
}