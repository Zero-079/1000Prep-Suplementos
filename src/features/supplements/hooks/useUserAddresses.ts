// src/features/supplements/hooks/useUserAddresses.ts
"use client"

import { useState, useEffect, useCallback } from "react"
import axiosInstance from "@/lib/axios"
import { useAuthContext } from "@/features/auth/context/AuthContext"

export interface UserAddress {
  id: string
  label: string
  street: string
  neighborhood: string
  city: string
  references: string
  isDefault: boolean
}

interface UseUserAddressesReturn {
  addresses: UserAddress[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useUserAddresses(): UseUserAddressesReturn {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext()
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated) {
      setAddresses([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get<UserAddress[]>("/users/me/addresses")
      setAddresses(response.data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar direcciones"
      setError(message)
      console.error("[useUserAddresses] Error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (authLoading) return
    fetchAddresses()
  }, [fetchAddresses, authLoading])

  return { addresses, isLoading, error, refetch: fetchAddresses }
}
