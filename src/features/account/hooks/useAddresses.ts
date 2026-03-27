// src/features/account/hooks/useAddresses.ts
"use client"

import { useState, useEffect, useCallback } from "react"
import {
  addressesService,
  type AddressResponse,
} from "../services/addresses.service"

interface UseAddressesReturn {
  addresses: AddressResponse[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAddresses(): UseAddressesReturn {
  const [addresses, setAddresses] = useState<AddressResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await addressesService.getAll()
      setAddresses(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las direcciones"
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  return { addresses, isLoading, error, refetch: fetchAddresses }
}
