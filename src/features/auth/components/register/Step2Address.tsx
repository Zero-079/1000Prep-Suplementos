"use client"

import { useFormContext } from "react-hook-form"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { RegisterFormData } from "../../schemas/register.schema"

interface Step2AddressProps {
  onNext: () => void
  onBack: () => void
}

export function Step2Address({ onNext, onBack }: Step2AddressProps) {
  const { register, formState: { errors }, trigger } = useFormContext<RegisterFormData>()

  const handleContinue = async () => {
    const isValid = await trigger(["address.label", "address.street", "address.neighborhood", "address.city"])
    if (isValid) onNext()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="address-label">Nombre de la direccion</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="address-label" type="text" placeholder="Casa, Trabajo, etc." {...register("address.label")} className="pl-10 h-11 rounded-lg" aria-invalid={!!errors.address?.label} />
        </div>
        {errors.address?.label && <p className="text-sm text-destructive">{errors.address.label.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address-street">Calle</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="address-street" type="text" placeholder="Calle 45 #12-34" {...register("address.street")} className="pl-10 h-11 rounded-lg" aria-invalid={!!errors.address?.street} />
        </div>
        {errors.address?.street && <p className="text-sm text-destructive">{errors.address.street.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address-neighborhood">Barrio</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="address-neighborhood" type="text" placeholder="El Poblado" {...register("address.neighborhood")} className="pl-10 h-11 rounded-lg" aria-invalid={!!errors.address?.neighborhood} />
        </div>
        {errors.address?.neighborhood && <p className="text-sm text-destructive">{errors.address.neighborhood.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address-city">Ciudad</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="address-city" type="text" placeholder="Medellin" {...register("address.city")} className="pl-10 h-11 rounded-lg" aria-invalid={!!errors.address?.city} />
        </div>
        {errors.address?.city && <p className="text-sm text-destructive">{errors.address.city.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address-references">Referencias (opcional)</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input id="address-references" type="text" placeholder="Apto 301, cerca al parque, etc." {...register("address.references")} className="pl-10 h-11 rounded-lg" aria-invalid={!!errors.address?.references} />
        </div>
        {errors.address?.references && <p className="text-sm text-destructive">{errors.address.references.message}</p>}
      </div>

      <div className="flex gap-3 mt-2">
        <Button type="button" variant="outline" onClick={onBack} className="h-11 rounded-lg flex-1">Atras</Button>
        <Button type="button" onClick={handleContinue} className="h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex-1">Continuar</Button>
      </div>
    </div>
  )
}
