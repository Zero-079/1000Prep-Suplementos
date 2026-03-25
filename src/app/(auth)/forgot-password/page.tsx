"use client"

import { ForgotPasswordForm } from "@/features/auth/components"
import type { ResetPasswordData } from "@/features/auth/components"

export default function ForgotPasswordPage() {
  async function handleResetPassword(data: ResetPasswordData) {
    console.log("Reset password:", data)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground text-balance">
          Recuperar contrasena
        </h1>
        <p className="text-muted-foreground">
          No te preocupes, te ayudamos a recuperar el acceso.
        </p>
      </div>
      <ForgotPasswordForm onResetPassword={handleResetPassword} />
    </div>
  )
}
