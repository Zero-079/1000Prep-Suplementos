"use client"

import { MapPin, Pencil, Trash2, Plus, Home, Building2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AddressResponse } from "../services/addresses.service"

function getAddressIcon(label: string) {
  const normalized = label.toLowerCase().trim()
  return normalized === "casa" ? "home" : "work"
}

export function AddressesSection({
  addresses,
  isLoading,
  error,
}: {
  addresses: AddressResponse[]
  isLoading: boolean
  error: string | null
}) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">
          Mis <span className="text-primary">direcciones</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Gestiona tus direcciones de entrega
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="size-8 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Cargando direcciones…</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div className="size-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <MapPin className="size-6 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {!isLoading && !error && addresses.length === 0 && <EmptyState />}

      {!isLoading && !error && addresses.length > 0 && (
        <div className="flex flex-col gap-4">
          {addresses.map((addr) => (
            <AddressCard key={addr.id} address={addr} />
          ))}

          <Button
            variant="outline"
            className="rounded-xl border-dashed border-primary/40 text-primary hover:bg-primary/5 hover:border-primary/60 gap-2 h-11 mt-2 w-fit"
          >
            <Plus className="size-4" />
            Agregar dirección
          </Button>
        </div>
      )}
    </div>
  )
}

function AddressCard({ address: addr }: { address: AddressResponse }) {
  const iconType = getAddressIcon(addr.label)

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-200 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          <div
            className={cn(
              "size-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
              iconType === "home"
                ? "bg-primary/10 text-primary"
                : "bg-secondary/10 text-secondary"
            )}
          >
            {iconType === "home" ? (
              <Home className="size-[18px]" />
            ) : (
              <Building2 className="size-[18px]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground mb-0.5">
              {addr.label}
            </p>
            <p className="text-sm text-muted-foreground">{addr.street}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {addr.neighborhood}, {addr.city}
            </p>
            {addr.references && (
              <p className="text-xs text-muted-foreground/70 mt-1 italic">
                Ref: {addr.references}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <Pencil className="size-3.5" />
          </button>
          <button className="size-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
      <div className="size-14 rounded-full bg-muted flex items-center justify-center">
        <MapPin className="size-6 text-muted-foreground/50" />
      </div>
      <div>
        <p className="font-semibold text-foreground mb-1">No tienes direcciones guardadas</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Agrega una dirección para agilizar tus próximas compras
        </p>
      </div>
      <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-2">
        <Plus className="size-4" />
        Agregar dirección
      </Button>
    </div>
  )
}
