"use client"

import { useState, useEffect } from "react"
import { MapPin, Pencil, Trash2, Plus, Home, Building2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { addressesService, type AddressResponse } from "../services/addresses.service"

function getAddressIcon(label: string) {
  const normalized = label.toLowerCase().trim()
  return normalized === "casa" ? "home" : "work"
}

// ── Form Dialog (add + edit) ────────────────────────────────────────────────
function AddressFormDialog({
  open,
  onOpenChange,
  onSuccess,
  address,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  address?: AddressResponse | null
}) {
  const isEdit = !!address

  const [label, setLabel] = useState("")
  const [street, setStreet] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [city, setCity] = useState("")
  const [references, setReferences] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-fill when editing
  useEffect(() => {
    if (address) {
      setLabel(address.label)
      setStreet(address.street)
      setNeighborhood(address.neighborhood)
      setCity(address.city)
      setReferences(address.references ?? "")
    }
  }, [address])

  const resetForm = () => {
    setLabel("")
    setStreet("")
    setNeighborhood("")
    setCity("")
    setReferences("")
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const payload = { label, street, neighborhood, city, references: references || undefined }

    try {
      if (isEdit && address) {
        await addressesService.update(address.id, payload)
      } else {
        await addressesService.create(payload)
      }
      resetForm()
      onOpenChange(false)
      onSuccess()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Error al ${isEdit ? "actualizar" : "guardar"} la dirección`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <DialogHeader className="pt-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-serif text-xl leading-tight">
                {isEdit ? "Editar dirección" : "Nueva dirección"}
              </DialogTitle>
              <DialogDescription className="mt-0.5">
                {isEdit
                  ? "Modifica los datos de tu dirección"
                  : "Completa los datos de entrega"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="addr-label" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Etiqueta
            </Label>
            <Input
              id="addr-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ej: Casa, Trabajo, Gimnasio"
              required
              className="h-11 rounded-xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary/40 transition-all duration-200"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="addr-street" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Dirección
            </Label>
            <Input
              id="addr-street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Ej: Calle 45 #12-38, Apto 502"
              required
              className="h-11 rounded-xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary/40 transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="addr-neighborhood" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Barrio
              </Label>
              <Input
                id="addr-neighborhood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ej: El Poblado"
                required
                className="h-11 rounded-xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary/40 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="addr-city" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Ciudad
              </Label>
              <Input
                id="addr-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: Medellín"
                required
                className="h-11 rounded-xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary/40 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="addr-references" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Referencias <span className="font-normal normal-case tracking-normal text-muted-foreground/60">(opcional)</span>
            </Label>
            <Input
              id="addr-references"
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              placeholder="Ej: Portón verde junto al parque"
              className="h-11 rounded-xl bg-muted/30 border-border/50 focus:bg-background focus:border-primary/40 transition-all duration-200"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium mt-2 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : null}
            {isEdit ? "Guardar cambios" : "Guardar dirección"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Section ─────────────────────────────────────────────────────────────────
export function AddressesSection({
  addresses,
  isLoading,
  error,
  onAddressAdded,
}: {
  addresses: AddressResponse[]
  isLoading: boolean
  error: string | null
  onAddressAdded: () => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null)
  const [deletingAddress, setDeletingAddress] = useState<AddressResponse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleEdit = (addr: AddressResponse) => {
    setEditingAddress(addr)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingAddress(null)
    setDialogOpen(true)
  }

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setEditingAddress(null)
  }

  const handleSuccess = () => {
    setEditingAddress(null)
    onAddressAdded()
  }

  const handleDeleteClick = (addr: AddressResponse) => {
    setDeleteError(null)
    setDeletingAddress(addr)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingAddress) return
    setIsDeleting(true)
    setDeleteError(null)

    try {
      await addressesService.remove(deletingAddress.id)
      setDeletingAddress(null)
      onAddressAdded()
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Error al eliminar la dirección"
      )
    } finally {
      setIsDeleting(false)
    }
  }

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

      {!isLoading && !error && addresses.length === 0 && (
        <EmptyState onAdd={handleAdd} />
      )}

      {!isLoading && !error && addresses.length > 0 && (
        <div className="flex flex-col gap-4">
          {addresses.map((addr) => (
            <AddressCard key={addr.id} address={addr} onEdit={handleEdit} onDelete={handleDeleteClick} />
          ))}

          <Button
            variant="outline"
            className="rounded-xl border-dashed border-primary/40 text-primary hover:bg-primary/5 hover:border-primary/60 gap-2 h-11 mt-2 w-fit"
            onClick={handleAdd}
          >
            <Plus className="size-4" />
            Agregar dirección
          </Button>
        </div>
      )}

      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={handleOpenChange}
        onSuccess={handleSuccess}
        address={editingAddress}
      />

      {/* Delete confirmation dialog — editorial dramatic */}
      <Dialog open={!!deletingAddress} onOpenChange={(open) => !open && setDeletingAddress(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl border-destructive/10 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Eliminar dirección</DialogTitle>
            <DialogDescription>Confirmar eliminación de dirección</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center text-center pt-2 pb-1">
            {/* Warning icon with pulse */}
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping opacity-20" />
              <div className="relative size-16 rounded-full bg-gradient-to-br from-destructive/15 to-destructive/5 flex items-center justify-center">
                <Trash2 className="size-7 text-destructive" />
              </div>
            </div>

            <h3 className="font-serif text-xl font-bold text-foreground mb-2">
              Eliminar dirección
            </h3>
            <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed mb-5">
              Esta acción es permanente. Se eliminará la siguiente dirección de tu cuenta:
            </p>

            {/* Address showcase — editorial card */}
            <div className="w-full bg-gradient-to-br from-destructive/[0.03] to-transparent border border-destructive/10 rounded-xl p-4 mb-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-destructive/30 to-transparent" />
              <p className="text-base font-semibold text-foreground mb-1 font-serif">
                {deletingAddress?.label}
              </p>
              <p className="text-sm text-foreground/70 font-mono tracking-tight">
                {deletingAddress?.street}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {deletingAddress?.neighborhood}, {deletingAddress?.city}
              </p>
            </div>

            {deleteError && (
              <p className="text-sm text-destructive mb-2">{deleteError}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 w-full">
              <Button
                variant="ghost"
                className="flex-1 h-11 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60"
                onClick={() => setDeletingAddress(null)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl bg-destructive text-white hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
              >
                {isDeleting ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="size-4 mr-2" />
                )}
                Eliminar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddressCard({
  address: addr,
  onEdit,
  onDelete,
}: {
  address: AddressResponse
  onEdit: (addr: AddressResponse) => void
  onDelete: (addr: AddressResponse) => void
}) {
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
          <button
            onClick={() => onEdit(addr)}
            className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            onClick={() => onDelete(addr)}
            className="size-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
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
      <Button
        className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-2"
        onClick={onAdd}
      >
        <Plus className="size-4" />
        Agregar dirección
      </Button>
    </div>
  )
}
