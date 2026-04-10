"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuthContext } from "@/features/auth/context/AuthContext"

function AuthCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthContext()

  const success = searchParams.get("success")
  const errorParam = searchParams.get("error")

  // Determinar el estado inicial del error fuera del effect
  const error = errorParam ? errorParam : null

  useEffect(() => {
    // Si la verificación de sesión terminó y el usuario está autenticado, redirigir
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/cuenta")
      } else if (success === "true") {
        // Si success=true pero no hay sesión, algo salió mal
        // No usamos setState aquí para evitar el warning
        // El estado de error se maneja con la variable errorParam
      }
    }
  }, [isLoading, isAuthenticated, success, router])

  // Estado de error - basado en searchParams, no en useState
  if (errorParam) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-destructive text-lg">Error de autenticación</div>
          <p className="text-muted-foreground">{errorParam}</p>
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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}