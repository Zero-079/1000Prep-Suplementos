// src/features/supplements/hooks/useSupplements.ts
"use client"

import { useMemo, useCallback } from "react"
import useSWR, { type SWRResponse } from "swr"
import { axiosFetcher } from "@/lib/use-swr"
import type { Supplement } from "../types/supplement"

interface UseSupplementsOptions {
  /** Limitar resultados a activos y con stock */
  filterActive?: boolean
  /** Intervalo de revalidación en ms (default: 30000 - 30s) */
  refreshInterval?: number
}

const SUPPLIMENTS_KEY = "/supplements"

/**
 * Hook para obtener suplementos con SWR
 * - Deduplicación automática de requests
 * - Cache en memoria
 * - Revalidación en background
 * - Mutaciones con revalidación automática
 */
export function useSupplements(options: UseSupplementsOptions = {}) {
  const { filterActive = true, refreshInterval = 30000 } = options

  const swrResponse = useSWR<Supplement[]>(
    SUPPLIMENTS_KEY,
    (key) => axiosFetcher<Supplement[]>(key),
    {
      // Revalidar cada 30 segundos en background
      refreshInterval,
      // No revalidar inmediatamente al ganar focus (evita flooding)
      revalidateOnFocus: false,
      // Revalidar al reconnectar
      revalidateOnReconnect: true,
      // Deduplicar requests en 2 segundos
      dedupingInterval: 2000,
    }
  )

  const { data, error, isLoading, isValidating } = swrResponse

  // Filtrar activos y con stock si se requiere
  const supplements = useMemo(() => {
    if (!data) return []
    if (!filterActive) return data
    return data.filter((s) => s.isActive === true && s.stock > 0)
  }, [data, filterActive])

  // Transformar error a string
  const errorMessage = error
    ? error.response?.data?.message || error.message || "Error al obtener los suplementos"
    : null

  // Función de refetch usando mutate - envuelta para retornar void
  const refetch = useCallback(async () => {
    await swrResponse.mutate()
  }, [swrResponse])

  return {
    supplements,
    isLoading,
    isValidating,
    error: errorMessage,
    refetch,
    mutate: swrResponse.mutate,
  }
}

/**
 * Hook para obtener un suplemento específico por ID
 */
export function useSupplementById(id: string | null) {
  const key = id ? `/supplements/${id}` : null

  const swrResponse = useSWR<Supplement>(
    key,
    (k) => axiosFetcher<Supplement>(k),
    {
      // No revalidar automáticamente para datos estáticos
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  const { data, error, isLoading, isValidating } = swrResponse

  const refetch = useCallback(async () => {
    await swrResponse.mutate()
  }, [swrResponse])

  return {
    supplement: data,
    isLoading,
    isValidating,
    error: error?.response?.data?.message || error?.message,
    refetch,
    mutate: swrResponse.mutate,
  }
}

/**
 * Hook para búsqueda de suplementos (sin filtros de activo/stock)
 * Nota: Para búsqueda en tiempo real, usar useSearch con debounce
 */
export function useSearchSupplements(query: string) {
  const key = query.trim().length >= 2 ? `/supplements?search=${encodeURIComponent(query.trim())}` : null

  const { data, error, isLoading, isValidating } = useSWR<Supplement[]>(
    key,
    (k) => axiosFetcher<Supplement[]>(k),
    {
      // No revalidar durante búsqueda
      revalidateOnFocus: false,
      dedupingInterval: 0,
    }
  )

  return {
    results: data || [],
    isLoading,
    isValidating,
    error: error?.response?.data?.message || error?.message,
  }
}