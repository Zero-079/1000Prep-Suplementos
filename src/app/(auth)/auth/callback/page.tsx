"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuthContext } from "@/features/auth/context/AuthContext"

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthContext()
  const [error, setError] = useState<string | null>(null)

  const success = searchParams.get("success")
  const errorParam = searchParams.get("error")

  useEffect(() => {
    // Si hay un error en el query, mostrarlo
    if (errorParam) {
      setError(errorParam)
      return
    }

    // Si la verificación de sesión terminó y el usuario está autenticado, redirigir
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/cuenta")
      } else if (success === "true") {
        // Si success=true pero no hay sesión, algo salió mal
        setError("No se pudo iniciar sesión. Intenta de nuevo.")
      }
    }
  }, [isLoading, isAuthenticated, success, errorParam, router])

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-destructive text-lg">Error de autenticación</div>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => router.replace("/login")}
            className="text-primary hover:underline"
          >
            Volver al login
          </button>
        </div>
      </div>
    )
  }

  // Estado de carga
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground">Verificando sesión...</p>
      </div>
    </div>
  )
}