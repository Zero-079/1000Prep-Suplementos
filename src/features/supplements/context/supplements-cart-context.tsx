// src/features/supplements/context/supplements-cart-context.tsx
"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import type { Supplement, SupplementCartItem } from "../types/supplement"

const CART_STORAGE_KEY = "supplement_cart"

interface SupplementCartContextType {
  items: SupplementCartItem[]
  addItem: (supplement: Supplement, quantity?: number) => void
  removeItem: (supplementId: string) => void
  updateQuantity: (supplementId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isHydrated: boolean
}

const SupplementCartContext = createContext<SupplementCartContextType | null>(null)

export function SupplementCartProvider({ children }: { children: ReactNode }) {
  // Always initialize as empty array on server to avoid hydration mismatch
  // Will sync with localStorage after hydration
  const [items, setItems] = useState<SupplementCartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Sync with localStorage after hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        setItems(JSON.parse(saved))
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsHydrated(true)
  }, [])

  // Persist to localStorage whenever items change (only after hydration)
  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // localStorage may fail in incognito or full storage
    }
  }, [items, isHydrated])

  const addItem = useCallback((supplement: Supplement, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.supplement.id === supplement.id)
      if (existing) {
        return prev.map((i) =>
          i.supplement.id === supplement.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { supplement, quantity }]
    })
  }, [])

  const removeItem = useCallback((supplementId: string) => {
    setItems((prev) => prev.filter((i) => i.supplement.id !== supplementId))
  }, [])

  const updateQuantity = useCallback((supplementId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.supplement.id !== supplementId))
      return
    }
    setItems((prev) =>
      prev.map((i) =>
        i.supplement.id === supplementId ? { ...i, quantity } : i
      )
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce(
    (sum, i) => sum + parseInt(i.supplement.price, 10) * i.quantity,
    0
  )

  return (
    <SupplementCartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isHydrated,
      }}
    >
      {children}
    </SupplementCartContext.Provider>
  )
}

export function useSupplementCart() {
  const ctx = useContext(SupplementCartContext)
  if (!ctx)
    throw new Error("useSupplementCart must be used within SupplementCartProvider")
  return ctx
}
