// src/features/supplements/hooks/useSupplements.ts
"use client"

import { useState, useEffect, useCallback } from "react"
import { supplementsService } from "../services/supplements.service"
import type { Supplement } from "../types/supplement"

export function useSupplements() {
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSupplements = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchSupplements()
  }, [fetchSupplements])

  return { supplements, isLoading, error, refetch: fetchSupplements }
}
