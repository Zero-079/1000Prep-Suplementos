// src/features/supplements/services/supplement-order.service.ts

import { fetchAPI } from "@/config/api"

export interface SupplementOrderItem {
  supplementId: string
  quantity: number
}

export interface CreateSupplementOrderPayload {
  items: SupplementOrderItem[]
  addressId: string
  notes?: string
  deliveryDate: string
}

export interface SupplementOrderResponse {
  id: string
  status: string
  totalAmount: number
  total: string
  deliveryDate: string
  expiresAt: string | null
  createdAt: string
}

class SupplementOrderService {
  async createOrder(
    payload: CreateSupplementOrderPayload
  ): Promise<SupplementOrderResponse> {
    return fetchAPI<SupplementOrderResponse>("/orders/supplement", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }
}

export const supplementOrderService = new SupplementOrderService()
