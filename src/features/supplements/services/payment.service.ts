// src/features/supplements/services/payment.service.ts

import axiosInstance from '@/lib/axios'

export interface InitPaymentResponse {
  paymentId: string
  paymentLink: string
  providerOrderId: string
}

class PaymentService {
  async initPayment(orderId: string): Promise<InitPaymentResponse> {
    const response = await axiosInstance.post<InitPaymentResponse>(`/payments/init/${orderId}`)
    return response.data
  }
}

export const paymentService = new PaymentService()