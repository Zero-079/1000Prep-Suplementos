// src/features/supplements/services/supplements.service.ts

import axiosInstance from '@/lib/axios'
import type { Supplement, SupplementBrand } from '@/features/supplements/types/supplement'

// Re-export SupplementBrand for external use
export type { SupplementBrand } from '@/features/supplements/types/supplement'

export interface CreateSupplementDto {
  brandId: string
  name: string
  description: string
  category: string
  price: number
  subscriberPrice: number
  stock: number
  servingSize: string
  usageInstructions?: string
  images: string[]
  nutrition: {
    servingsPerContainer: number
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

class SupplementsService {
  async getSupplements(): Promise<Supplement[]> {
    try {
      const response = await axiosInstance.get<Supplement[]>('/supplements')
      return response.data.filter((s) => s.isActive === true && s.stock > 0)
    } catch (error) {
      console.error('Error fetching supplements:', error)
      throw error
    }
  }

  async searchSupplements(query: string): Promise<Supplement[]> {
    try {
      const response = await axiosInstance.get<Supplement[]>('/supplements', {
        params: { search: query },
      })
      return response.data.filter((s) => s.isActive === true && s.stock > 0)
    } catch (error) {
      console.error('Error searching supplements:', error)
      throw error
    }
  }

  async getSupplementById(id: string): Promise<Supplement | null> {
    try {
      const response = await axiosInstance.get<Supplement>(`/supplements/${id}`)
      return response.data
    } catch (error: unknown) {
      // Distinguish between 404 (not found) and other errors (network, server, etc.)
      const axiosError = error as { response?: { status?: number } }
      const status = axiosError.response?.status
      if (status === 404) {
        // Return null for 404 - caller will handle as not found
        console.log('Supplement not found:', id)
        return null
      }
      // For other errors (network, server errors), throw so caller can handle appropriately
      console.error('Error fetching supplement by id:', error)
      throw error
    }
  }

  async getBrands(): Promise<SupplementBrand[]> {
    try {
      // Intentar obtener brands directamente del endpoint
      const response = await axiosInstance.get<SupplementBrand[]>('/supplements/brands')
      return response.data
    } catch (error: unknown) {
      // Si el endpoint no existe (404), obtener supplements y extraer brands únicas
      const axiosError = error as { response?: { status?: number } }
      const status = axiosError.response?.status
      if (status === 404) {
        console.warn('Endpoint /supplements/brands not found, extracting brands from supplements')
        const supplements = await this.getSupplements()
        const uniqueBrandsMap = new Map<string, SupplementBrand>()

        for (const supplement of supplements) {
          if (!uniqueBrandsMap.has(supplement.brand.id)) {
            uniqueBrandsMap.set(supplement.brand.id, supplement.brand)
          }
        }

        return Array.from(uniqueBrandsMap.values())
      }
      // Para otros errores, throw para que el caller maneje
      console.error('Error fetching brands:', error)
      throw error
    }
  }

  async createBrand(data: { name: string; logoUrl?: string }): Promise<SupplementBrand> {
    try {
      const response = await axiosInstance.post<SupplementBrand>('/supplements/brands', data)
      return response.data
    } catch (error) {
      console.error('Error creating brand:', error)
      throw error
    }
  }

  async createSupplement(data: CreateSupplementDto): Promise<Supplement> {
    try {
      const response = await axiosInstance.post<Supplement>('/supplements', data)
      return response.data
    } catch (error) {
      console.error('Error creating supplement:', error)
      throw error
    }
  }

  async updateSupplement(id: string, data: Partial<CreateSupplementDto>): Promise<Supplement> {
    try {
      const response = await axiosInstance.patch<Supplement>(`/supplements/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating supplement:', error)
      throw error
    }
  }

  async deleteSupplement(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/supplements/${id}`)
    } catch (error) {
      console.error('Error deleting supplement:', error)
      throw error
    }
  }

  async uploadImage(supplementId: string, file: File, order?: number): Promise<string> {
    try {
      console.log(
        `[uploadImage] Subiendo imagen para supplement ${supplementId}, order: ${order}, file: ${file.name}, size: ${file.size}, type: ${file.type}`
      )

      const formData = new FormData()
      formData.append('file', file)
      // Enviar order solo si está definido
      if (order !== undefined) {
        formData.append('order', order.toString())
      }

      console.log(`[uploadImage] FormData preparado, keys:`, Array.from(formData.keys()))

      const response = await axiosInstance.post<{ url: string }>(`/supplements/${supplementId}/images`, formData)

      console.log(`[uploadImage] Respuesta:`, response.data)
      return response.data.url
    } catch (error) {
      console.error('[uploadImage] Error al subir imagen:', error)
      const axiosError = error as { response?: { status?: number } }
      const status = axiosError.response?.status
      if (status === 400) {
        console.error('[uploadImage] Bad Request - ya existe imagen en ese orden')
      }
      if (status === 404) {
        console.error('[uploadImage] El endpoint no existe')
      }
      throw error
    }
  }
}

export const supplementsService = new SupplementsService()