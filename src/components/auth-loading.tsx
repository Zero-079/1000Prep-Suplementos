// src/components/auth-loading.tsx
"use client"

import { useAuthContext } from "@/features/auth/context/AuthContext"
import { Loader2 } from "lucide-react"

interface AuthLoaderProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Componente que muestra un loading state mientras se verifica la sesión
 * y luego renderiza los children. Esto permite usar Suspense en el layout.
 */
export function AuthLoader({ children, fallback }: AuthLoaderProps) {
  const { isLoading } = useAuthContext()

  if (isLoading) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * Skeleton más específico para el header durante carga de auth
 */
export function HeaderSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
      <nav className="max-w-7xl mx-auto bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between h-16 md:h-20 px-4 md:px-6 lg:px-8">
          {/* Logo skeleton */}
          <div className="flex items-center gap-1.5">
            <div className="w-32 h-8 bg-muted animate-pulse rounded" />
          </div>

          {/* Right side skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-20 bg-muted animate-pulse rounded-full" />
            <div className="h-9 w-24 bg-muted animate-pulse rounded-full" />
          </div>
        </div>
      </nav>
    </header>
  )
}