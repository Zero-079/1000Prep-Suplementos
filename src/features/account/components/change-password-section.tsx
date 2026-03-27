"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ChangePasswordSection() {
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">
          Cambiar <span className="text-primary">contraseña</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Asegúrate de usar una contraseña segura
        </p>
      </div>

      <div className="flex flex-col gap-5 max-w-md">
        <div className="flex flex-col gap-2">
          <Label htmlFor="current-pw" className="text-sm font-medium text-foreground">
            Contraseña actual
          </Label>
          <Input
            id="current-pw"
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            placeholder="••••••••"
            className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="new-pw" className="text-sm font-medium text-foreground">
            Nueva contraseña
          </Label>
          <Input
            id="new-pw"
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm-pw" className="text-sm font-medium text-foreground">
            Confirmar nueva contraseña
          </Label>
          <Input
            id="confirm-pw"
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Repite la nueva contraseña"
            className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors"
          />
        </div>

        <Button className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium mt-2 w-fit px-8 transition-all duration-200 hover:shadow-md">
          Guardar cambios
        </Button>
      </div>
    </div>
  )
}
