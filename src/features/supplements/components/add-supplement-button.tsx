// src/features/supplements/components/add-supplement-button.tsx
"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddSupplementButtonProps {
  onClick?: () => void
}

export function AddSupplementButton({ onClick }: AddSupplementButtonProps) {
  return (
    <Button
      className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
      size="lg"
      onClick={onClick}
    >
      <Plus className="w-5 h-5" />
      Agregar Suplemento
    </Button>
  )
}
