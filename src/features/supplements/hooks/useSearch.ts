// src/features/supplements/hooks/useSearch.ts
"use client"

import { useState, useEffect, useCallback } from "react"
import { supplementsService } from "../services/supplements.service"
import type { Supplement } from "../types/supplement"

interface UseSearchReturn {
  query: string
  setQuery: (query: string) => void
  results: Supplement[]
  isLoading: boolean
  error: string | null
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function useSearch(debounceMs: number = 300): UseSearchReturn {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Supplement[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // No buscar si query está vacío o es muy corto
    if (!query || query.trim().length < 2) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const timeoutId = setTimeout(async () => {
      try {
        const data = await supplementsService.searchSupplements(query.trim())
        setResults(data.slice(0, 5)) // Limitar a 5 resultados para el dropdown
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al buscar")
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [query, debounceMs])

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    isOpen,
    setIsOpen,
  }
}
