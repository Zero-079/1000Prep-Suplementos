"use client"

import { useState } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AccountUser {
  name: string
  email: string
  phone?: string
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function SkeletonField() {
  return <div className="h-11 rounded-xl bg-muted animate-pulse" />
}

export function AccountInfoSection({
  user,
  isLoading,
}: {
  user: AccountUser | null
  isLoading: boolean
}) {
  const [name, setName] = useState(user?.name ?? "")
  const [phone, setPhone] = useState(user?.phone ?? "")
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">
          Información de <span className="text-primary">cuenta</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Actualiza tus datos personales
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {/* Avatar inline */}
        <div className="shrink-0 flex flex-col items-center">
          <div
            className="relative group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="size-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-[3px] border-primary/20 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/10">
              {isLoading ? (
                <div className="size-full bg-muted animate-pulse rounded-full" />
              ) : (
                <span className="text-2xl font-bold text-primary/70 select-none font-serif">
                  {getInitials(name)}
                </span>
              )}
            </div>
            {!isLoading && (
              <div
                className={cn(
                  "absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-all duration-300",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
              >
                <Camera className="size-5 text-white" />
              </div>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            JPG, PNG o WEBP
          </p>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-5 flex-1 max-w-md">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nombre" className="text-sm font-medium text-foreground">
              Nombre completo
            </Label>
            {isLoading ? (
              <SkeletonField />
            ) : (
              <Input
                id="nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="telefono" className="text-sm font-medium text-foreground">
              Teléfono
            </Label>
            {isLoading ? (
              <SkeletonField />
            ) : (
              <Input
                id="telefono"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+57 300 123 4567"
                className="h-11 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-colors"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Correo electrónico
            </Label>
            {isLoading ? (
              <SkeletonField />
            ) : (
              <>
                <Input
                  id="email"
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  className="h-11 rounded-xl bg-muted/30 border-border/40 text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground/60">
                  El correo no se puede modificar
                </p>
              </>
            )}
          </div>

          {!isLoading && (
            <Button className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium mt-2 w-fit px-8 transition-all duration-200 hover:shadow-md">
              Modificar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
