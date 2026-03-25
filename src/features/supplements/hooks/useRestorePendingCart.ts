// src/features/supplements/hooks/useRestorePendingCart.ts
"use client"

import { useEffect, useRef } from "react"
import { useAuthContext } from "@/features/auth/context/AuthContext"
import { useSupplementCart } from "@/features/supplements/context/supplements-cart-context"
import { supplementsService } from "@/features/supplements/services/supplements.service"

const CART_STORAGE_KEY = "supplement_cart_pending"

export function useRestorePendingCart() {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext()
  const { items, addItem } = useSupplementCart()
  const restored = useRef(false)

  useEffect(() => {
    if (authLoading || !isAuthenticated || restored.current) return

    const raw = sessionStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return

    restored.current = true
    sessionStorage.removeItem(CART_STORAGE_KEY)

    let snapshot: Array<{ id: string; quantity: number }> = []
    try {
      snapshot = JSON.parse(raw)
    } catch {
      return
    }

    if (!snapshot.length) return

    ;(async () => {
      try {
        const allSupplements = await supplementsService.getSupplements()
        snapshot.forEach(({ id, quantity }) => {
          const supplement = allSupplements.find((s) => s.id === id)
          if (supplement) {
            const alreadyInCart = items.some((i) => i.supplement.id === id)
            if (!alreadyInCart) {
              addItem(supplement, quantity)
            }
          }
        })
      } catch {
        // silently ignore
      }
    })()
  }, [isAuthenticated, authLoading]) // eslint-disable-line react-hooks/exhaustive-deps
}
