"use client"

import { useState, useEffect, useCallback } from "react"
import axiosInstance from "@/lib/axios"

export interface OrderAddress {
  id: string
  label: string
  street: string
  neighborhood: string
  city: string
  references: string
  isDefault: boolean
}

export interface OrderItem {
  id: string
  orderId: string
  supplementId: string | null
  dailyMenuMealId: string | null
  quantity: number
  unitPrice: string
  subtotal: string
}

export interface OrderPayment {
  id: string
  status: string
  method: string
  amount: string
  currency: string
  paidAt: string | null
  paymentLink: string | null
  providerOrderId: string | null
}

export interface Order {
  id: string
  orderType: "SUPPLEMENT" | "MEAL" | string
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED" | "COMPLETED" | "EXPIRED" | string
  subtotal: string
  discount: string
  total: string
  deliveryDate: string | null
  expiresAt: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  address: OrderAddress | null
  payment: OrderPayment | null
  userId: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
}

interface UseSellerOrdersReturn {
  orders: Order[]
  usersMap: Map<string, User>
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useSellerOrders(): UseSellerOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([])
  const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // El endpoint correcto para que SELLER vea todos los pedidos de suplementos
      const ordersResponse = await axiosInstance.get<Order[]>("/orders/supplement")
      const fetchedOrders = ordersResponse.data
      
      setOrders(fetchedOrders)

      // Obtiene usuarios únicos de las órdenes
      const userIds = [...new Set(fetchedOrders.map((o) => o.userId).filter(Boolean))]
      if (userIds.length > 0) {
        // Usar Promise.all con map para mantener el orden correcto
        const usersResponses = await Promise.all(
          userIds.map(async (userId) => {
            try {
              const userResponse = await axiosInstance.get<User>(`/users/${userId}`)
              return { userId, user: userResponse.data }
            } catch {
              return { userId, user: null }
            }
          })
        )
        // Create usersMap correctamente
        const newUsersMap = new Map<string, User>()
        usersResponses.forEach(({ userId, user }) => {
          if (user) {
            newUsersMap.set(userId, user)
          }
        })
        setUsersMap(newUsersMap)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las órdenes")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return { orders, usersMap, isLoading, error, refetch: fetchOrders }
}
