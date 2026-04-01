"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { Loader2, Lock, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isAuthLoading } = useAuth()

  // Still checking session — show spinner
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-muted/40">
        <Header />
        <main className="flex flex-col items-center justify-center pt-32 pb-20 gap-4">
          <Loader2 className="size-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Verificando sesión…</p>
        </main>
        <Footer />
      </div>
    )
  }

  // Not authenticated — show blocked message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/40">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center gap-6 text-center px-6 min-h-[calc(100vh-0px)]">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="size-10 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
              Acceso restringido
            </h1>
            <p className="text-muted-foreground max-w-md">
              Necesitás iniciar sesión para acceder a esta página.
            </p>
          </div>
          <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Link href="/login">
              <LogIn className="size-4" />
              Iniciar sesión
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  // Authenticated — render children
  return <>{children}</>
}
