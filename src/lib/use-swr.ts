// src/lib/use-swr.ts
"use client"

import useSWR, { type SWRConfiguration, type SWRResponse } from "swr"
import axiosInstance from "./axios"
import type { AxiosError } from "axios"

type FetcherOptions = {
  url: string
  config?: RequestInit
}

type FetcherResponse<T> = {
  data: T | undefined
  error: AxiosError | null
}

/**
 * Fetcher function para usar con SWR que utiliza axiosInstance
 * Maneja automáticamente errores y tipos
 */
export async function axiosFetcher<T>(url: string): Promise<T> {
  const response = await axiosInstance.get<T>(url)
  return response.data
}

/**
 * Hook base para cualquier endpoint con SWR
 * Proporciona deduplicación automática, caching y revalidación
 */
export function useSwrFetch<T>(
  url: string | null | undefined,
  options?: SWRConfiguration<T>
): SWRResponse<T, AxiosError> {
  return useSWR<T, AxiosError>(
    url,
    (key) => axiosFetcher<T>(key),
    {
      // Opciones por defecto optimizadas
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000, // 2 segundos de deduplicación
      ...options,
    }
  )
}

/**
 * Hook para GET con cache y deduplicación automática
 */
export function useGet<T>(
  url: string | null | undefined,
  options?: SWRConfiguration<T>
): SWRResponse<T, AxiosError> {
  return useSwrFetch<T>(url, options)
}

/**
 * Hook para búsqueda con fallback inmediato
 */
export function useSearch<T>(
  url: string | null | undefined,
  debounceMs: number = 300,
  options?: SWRConfiguration<T>
): SWRResponse<T, AxiosError> & { isValidating: boolean } {
  return useSwrFetch<T>(url, {
    ...options,
    // No revalidar mientras está en modo búsqueda
    revalidateOnFocus: false,
  })
}