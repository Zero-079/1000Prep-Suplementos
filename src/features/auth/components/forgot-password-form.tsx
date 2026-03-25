"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface ResetPasswordData {
  email: string
  newPassword: string
  confirmPassword: string
}

interface ForgotPasswordFormProps {
  onResetPassword: (data: ResetPasswordData) => Promise<void> | void
}

export function ForgotPasswordForm({ onResetPassword }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  function validateStep1(): boolean {
    const next: typeof errors = {}
    if (!email) next.email = "El correo es obligatorio"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Ingresa un correo valido"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function validateStep2(): boolean {
    const next: typeof errors = {}
    if (!newPassword) next.newPassword = "La contrasena es obligatoria"
    else if (newPassword.length < 8) next.newPassword = "Minimo 8 caracteres"
    if (!confirmPassword) next.confirmPassword = "Confirma tu contrasena"
    else if (newPassword !== confirmPassword) next.confirmPassword = "Las contrasenas no coinciden"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleStep1(e: FormEvent) {
    e.preventDefault()
    if (!validateStep1()) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setErrors({})
    setStep(2)
  }

  async function handleStep2(e: FormEvent) {
    e.preventDefault()
    if (!validateStep2()) return
    setIsSubmitting(true)
    try { await onResetPassword({ email, newPassword, confirmPassword }) }
    finally { setIsSubmitting(false) }
  }

  if (step === 1) {
    return (
      <form onSubmit={handleStep1} className="flex flex-col gap-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Ingresa tu correo electronico y te enviaremos las instrucciones para restablecer tu contrasena.
        </p>
        <div className="flex flex-col gap-2">
          <Label htmlFor="forgot-email">Correo electronico</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input id="forgot-email" type="email" placeholder="tu@correo.com" value={email}
              onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 rounded-lg" aria-invalid={!!errors.email} />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 mt-1">
          {isSubmitting ? "Enviando..." : "Enviar instrucciones"}
        </Button>
        <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" />Volver al inicio de sesion
        </Link>
      </form>
    )
  }

  return (
    <form onSubmit={handleStep2} className="flex flex-col gap-5">
      <div className="flex items-start gap-3 rounded-lg bg-primary/10 p-4">
        <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-foreground leading-relaxed">
          Hemos enviado un enlace de verificacion a <span className="font-semibold">{email}</span>. Ahora puedes crear tu nueva contrasena.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="new-password">Nueva contrasena</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="new-password" type={showPassword ? "text" : "password"} placeholder="Minimo 8 caracteres" value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} className="pl-10 pr-10 h-11 rounded-lg" aria-invalid={!!errors.newPassword} />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Ocultar" : "Mostrar"}>
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm-new-password">Confirmar nueva contrasena</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="confirm-new-password" type={showConfirm ? "text" : "password"} placeholder="Repite tu nueva contrasena" value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 pr-10 h-11 rounded-lg" aria-invalid={!!errors.confirmPassword} />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirm ? "Ocultar" : "Mostrar"}>
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 mt-1">
        {isSubmitting ? "Restableciendo..." : "Restablecer contrasena"}
      </Button>
      <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-4" />Volver al inicio de sesion
      </Link>
    </form>
  )
}
