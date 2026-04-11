// src/features/supplements/hooks/useSearch.ts
"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import useSWR from "swr"
import { axiosFetcher } from "@/lib/use-swr"
import type { Supplement } from "@/features/supplements/types/supplement"

interface UseSearchOptions {
  /** Intervalo de debounce en ms (default: 300) */
  debounceMs?: number
  /** Cantidad máxima de resultados (default: 5) */
  maxResults?: number
  /** Habilitar deduplicación (default: true) */
  dedupe?: boolean
}

interface UseSearchReturn {
  query: string
  setQuery: (query: string) => void
  results: Supplement[]
  isLoading: boolean
  isValidating: boolean
  error: string | null
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  clearSearch: () => void
}

/**
 * Hook de debounce simple - implementado inline
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para búsqueda en tiempo real con debounce y SWR
 * - Debounce para evitar flooding de requests
 * - SWR para deduplicación y cache
 * - UI state management para el dropdown
 */
export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { debounceMs = 300, maxResults = 5, dedupe = true } = options

  // Estado local para el query
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  // Debounce del query para evitar muchos requests
  const debouncedQuery = useDebounce(query, debounceMs)

  // Construir la key solo cuando hay query válida
  const searchKey = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) return null
    return `/supplements?search=${encodeURIComponent(debouncedQuery.trim())}`
  }, [debouncedQuery])

  // Fetch con SWR - solo cuando hay key válida
  const { data, error, isLoading, isValidating } = useSWR<Supplement[]>(
    searchKey,
    (key) => axiosFetcher<Supplement[]>(key),
    {
      // Opciones optimizadas para búsqueda
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: dedupe ? 500 : 0,
      // No revalidar automáticamente en búsqueda
      refreshInterval: 0,
      // Mantener datos anteriores mientras carga nueva búsqueda
      keepPreviousData: true,
    }
  )

  // Limitar resultados al máximo especificado
  const results = useMemo(() => {
    if (!data) return []
    return data.slice(0, maxResults)
  }, [data, maxResults])

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    setQuery("")
    setIsOpen(false)
  }, [])

  // Error como string
  const errorMessage = error
    ? error.response?.data?.message || error.message || "Error al buscar"
    : null

  return {
    query,
    setQuery,
    results,
    isLoading,
    isValidating,
    error: errorMessage,
    isOpen,
    setIsOpen,
    clearSearch,
  }
}