// src/features/account/services/addresses.service.ts
import axiosInstance from '@/lib/axios'

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
    const response = await axiosInstance.get<AddressResponse[]>('/users/me/addresses')
    return response.data
  },

  async create(data: AddressPayload): Promise<AddressResponse> {
    const response = await axiosInstance.post<AddressResponse>('/users/me/addresses', data)
    return response.data
  },

  async update(id: string, data: Partial<AddressPayload>): Promise<AddressResponse> {
    const response = await axiosInstance.patch<AddressResponse>(`/users/me/addresses/${id}`, data)
    return response.data
  },

  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`/users/me/addresses/${id}`)
  },
}