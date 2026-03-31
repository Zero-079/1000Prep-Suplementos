"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { loginSchema, type LoginFormData } from "../schemas/login.schema"
import { GoogleAuthButton } from "./google-auth-button"
import { authService } from "../services/auth.service"

interface LoginFormProps {
  onLogin: (data: LoginFormData) => Promise<void> | void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  })

  async function onSubmit(data: LoginFormData) {
    await onLogin(data)
  }

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)
    authService.loginWithGoogle()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-email">Correo electronico</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="login-email"
            type="email"
            placeholder="tu@correo.com"
            {...register("email")}
            className="pl-10 h-11 rounded-lg"
            aria-invalid={!!errors.email}
          />
        </div>
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-password">Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Tu contraseña"
            {...register("password")}
            className="pl-10 pr-10 h-11 rounded-lg"
            aria-invalid={!!errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="remember"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
            Recuerdame
          </Label>
        </div>
        <Link href="/forgot-password" className="text-sm text-primary font-medium hover:underline">
          Olvide mi contraseña
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 mt-1"
      >
        {isSubmitting ? "Iniciando sesion..." : "Iniciar sesion"}
      </Button>

      <div className="flex items-center gap-3 -my-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-wide">o</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <GoogleAuthButton 
        label="Iniciar sesion con Google" 
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
      />

      <p className="text-center text-sm text-muted-foreground">
        {"No tienes cuenta? "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Registrate
        </Link>
      </p>
    </form>
  )
}