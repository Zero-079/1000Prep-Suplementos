// src/features/supplements/services/supplements.service.ts

import { fetchAPI } from "@/config/api"
import type { Supplement, SupplementBrand } from "@/features/supplements/types/supplement"

// Re-export SupplementBrand for external use
export type { SupplementBrand } from "@/features/supplements/types/supplement"

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
      const data = await fetchAPI<Supplement[]>("/supplements", {
        method: "GET",
      })
      return data.filter((s) => s.isActive === true && s.stock > 0)
    } catch (error) {
      console.error("Error fetching supplements:", error)
      throw error
    }
  }

  async searchSupplements(query: string): Promise<Supplement[]> {
    try {
      const data = await fetchAPI<Supplement[]>("/supplements", {
        method: "GET",
        params: { search: query },
      })
      return data.filter((s) => s.isActive === true && s.stock > 0)
    } catch (error) {
      console.error("Error searching supplements:", error)
      throw error
    }
  }

  async getSupplementById(id: string): Promise<Supplement | null> {
    try {
      const data = await fetchAPI<Supplement>(`/supplements/${id}`, {
        method: "GET",
      })
      return data
    } catch (error) {
      // Distinguish between 404 (not found) and other errors (network, server, etc.)
      const status = (error as any)?.status
      if (status === 404) {
        // Return null for 404 - caller will handle as not found
        console.log("Supplement not found:", id)
        return null
      }
      // For other errors (network, server errors), throw so caller can handle appropriately
      console.error("Error fetching supplement by id:", error)
      throw error
    }
  }

  async getBrands(): Promise<SupplementBrand[]> {
    try {
      // Intentar obtener brands directamente del endpoint
      const data = await fetchAPI<SupplementBrand[]>("/supplements/brands", {
        method: "GET",
      })
      return data
    } catch (error) {
      // Si el endpoint no existe (404), obtener supplements y extraer brands únicas
      const status = (error as any)?.status
      if (status === 404) {
        console.warn("Endpoint /supplements/brands not found, extracting brands from supplements")
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
      console.error("Error fetching brands:", error)
      throw error
    }
  }

  async createBrand(data: { name: string; logoUrl?: string }): Promise<SupplementBrand> {
    try {
      const result = await fetchAPI<SupplementBrand>("/supplements/brands", {
        method: "POST",
        body: JSON.stringify(data),
      })
      return result
    } catch (error) {
      console.error("Error creating brand:", error)
      throw error
    }
  }

  async createSupplement(data: CreateSupplementDto): Promise<Supplement> {
    try {
      const result = await fetchAPI<Supplement>("/supplements", {
        method: "POST",
        body: JSON.stringify(data),
      })
      return result
    } catch (error) {
      console.error("Error creating supplement:", error)
      throw error
    }
  }

  async updateSupplement(id: string, data: Partial<CreateSupplementDto>): Promise<Supplement> {
    try {
      const result = await fetchAPI<Supplement>(`/supplements/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
      return result
    } catch (error) {
      console.error("Error updating supplement:", error)
      throw error
    }
  }

  async deleteSupplement(id: string): Promise<void> {
    try {
      await fetchAPI<void>(`/supplements/${id}`, {
        method: "DELETE",
      })
    } catch (error) {
      console.error("Error deleting supplement:", error)
      throw error
    }
  }

  async uploadImage(supplementId: string, file: File, index: number = 0): Promise<string> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("index", index.toString())

      const result = await fetchAPI<{ url: string }>(`/supplements/${supplementId}/images`, {
        method: "POST",
        body: formData,
      })
      return result.url
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }
}

export const supplementsService = new SupplementsService()
