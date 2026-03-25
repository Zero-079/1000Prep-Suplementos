"use client"

import { RegisterFlow } from "@/features/auth/components"
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function RegisterPage() {
  const { error } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground text-balance">
          Crea tu cuenta
        </h1>
        <p className="text-muted-foreground">
          Empieza tu camino hacia suplementos de calidad profesional.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      <RegisterFlow />
    </div>
  )
}
