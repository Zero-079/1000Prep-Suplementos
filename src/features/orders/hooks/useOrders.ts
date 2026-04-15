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
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "EXPIRED" | string
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

interface UseOrdersReturn {
  orders: Order[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  updateOrderStatus: (orderId: string, status: string) => Promise<void>
}

export type AllowedOrderStatus = "DELIVERED" | "ON_THE_WAY"

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get<Order[]>("/orders")
      setOrders(response.data.filter((o) => o.orderType === "SUPPLEMENT"))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los pedidos")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    try {
      await axiosInstance.patch("/orders/status", { orderId, status })
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      )
    } catch (err) {
      throw err instanceof Error ? err : new Error("Error al actualizar el estado")
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return { orders, isLoading, error, refetch: fetchOrders, updateOrderStatus }
}
