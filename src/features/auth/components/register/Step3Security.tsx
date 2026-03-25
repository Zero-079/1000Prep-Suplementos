"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { RegisterFormData } from "../../schemas/register.schema"

interface Step3SecurityProps {
  onBack: () => void
}

export function Step3Security({ onBack }: Step3SecurityProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, formState: { errors } } = useFormContext<RegisterFormData>()

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="register-password">Contrasena</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="register-password" type={showPassword ? "text" : "password"} placeholder="Minimo 8 caracteres" {...register("password")} className="pl-10 pr-10 h-11 rounded-lg" aria-invalid={!!errors.password} />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}>
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="register-confirm">Confirmar contrasena</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="register-confirm" type={showConfirmPassword ? "text" : "password"} placeholder="Repite tu contrasena" {...register("confirmPassword")} className="pl-10 pr-10 h-11 rounded-lg" aria-invalid={!!errors.confirmPassword} />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirmPassword ? "Ocultar contrasena" : "Mostrar contrasena"}>
            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
      </div>

      <div className="flex gap-3 mt-1">
        <Button type="button" variant="outline" onClick={onBack} className="h-11 rounded-lg flex-1">Atras</Button>
        <Button type="submit" className="h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex-1">Crear cuenta</Button>
      </div>
    </div>
  )
}
