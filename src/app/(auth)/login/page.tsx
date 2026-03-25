"use client"

import { LoginForm } from "@/features/auth/components"
import type { LoginFormData } from "@/features/auth/components"
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function LoginPage() {
  const { login, error } = useAuth()

  async function handleLogin(data: LoginFormData) {
    try {
      await login(data)
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground text-balance">
          Bienvenido de vuelta
        </h1>
        <p className="text-muted-foreground">
          Inicia sesion para acceder a tus suplementos.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      <LoginForm onLogin={handleLogin} />
    </div>
  )
}
