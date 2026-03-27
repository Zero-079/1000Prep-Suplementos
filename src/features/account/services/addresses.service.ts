// src/features/account/services/addresses.service.ts
import { fetchAPI } from "@/config/api"

export interface AddressPayload {
  label: string
  street: string
  neighborhood: string
  city: string
  references?: string
}

export interface AddressResponse {
  id: string
  label: string
  street: string
  neighborhood: string
  city: string
  references: string
}

export const addressesService = {
  async getAll(): Promise<AddressResponse[]> {
    return fetchAPI<AddressResponse[]>("/users/me/addresses", {
      method: "GET",
    })
  },
}
