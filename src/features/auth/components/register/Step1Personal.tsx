"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import Link from "next/link"
import { User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { RegisterFormData } from "../../schemas/register.schema"
import { GoogleAuthButton } from "../google-auth-button"
import { authService } from "../../services/auth.service"

interface Step1PersonalProps {
  onNext: () => void
}

export function Step1Personal({ onNext }: Step1PersonalProps) {
  const { register, formState: { errors }, trigger } = useFormContext<RegisterFormData>()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleContinue = async () => {
    const isValid = await trigger(["name", "email", "phone"])
    if (isValid) onNext()
  }

  const handleGoogleRegister = () => {
    setIsGoogleLoading(true)
    authService.loginWithGoogle()
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="register-name">Nombre completo</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="register-name" type="text" placeholder="Tu nombre completo" {...register("name")} className="pl-10 h-11 rounded-lg" aria-invalid={!!errors.name} />
        </div>
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="register-email">Correo electronico</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="register-email" type="email" placeholder="tu@correo.com" {...register("email")} className="pl-10 h-11 rounded-lg" aria-invalid={!!errors.email} />
        </div>
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="register-phone">Telefono</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="register-phone" type="tel" placeholder="3001234567" {...register("phone")} className="pl-10 h-11 rounded-lg" aria-invalid={!!errors.phone} />
        </div>
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>

      <Button type="button" onClick={handleContinue} className="h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 mt-1">
        Continuar
      </Button>

      <div className="flex items-center gap-3 -my-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-wide">o</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <GoogleAuthButton 
        label="Registrarse con Google" 
        onClick={handleGoogleRegister}
        disabled={isGoogleLoading}
      />

      <p className="text-center text-sm text-muted-foreground">
        {"Ya tienes cuenta? "}
        <Link href="/login" className="text-primary font-medium hover:underline">Inicia sesion</Link>
      </p>
    </div>
  )
}
