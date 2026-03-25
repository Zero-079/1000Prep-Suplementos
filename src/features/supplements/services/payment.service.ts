// src/features/supplements/services/payment.service.ts

import { fetchAPI } from "@/config/api"

export interface InitPaymentResponse {
  paymentId: string
  paymentLink: string
  providerOrderId: string
}

class PaymentService {
  async initPayment(orderId: string): Promise<InitPaymentResponse> {
    return fetchAPI<InitPaymentResponse>(`/payments/init/${orderId}`, {
      method: "POST",
    })
  }
}

export const paymentService = new PaymentService()
