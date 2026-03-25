// src/features/supplements/hooks/useSupplements.ts
"use client"

import { useState, useEffect } from "react"
import { supplementsService } from "../services/supplements.service"
import type { Supplement } from "../types/supplement"

export function useSupplements() {
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await supplementsService.getSupplements()
        setSupplements(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al obtener los suplementos"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchSupplements()
  }, [])

  return { supplements, isLoading, error }
}
