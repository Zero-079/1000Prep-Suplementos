// src/features/supplements/services/supplement-order.service.ts

import axiosInstance from '@/lib/axios'

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
  async createOrder(payload: CreateSupplementOrderPayload): Promise<SupplementOrderResponse> {
    const response = await axiosInstance.post<SupplementOrderResponse>('/orders/supplement', payload)
    return response.data
  }
}

export const supplementOrderService = new SupplementOrderService()