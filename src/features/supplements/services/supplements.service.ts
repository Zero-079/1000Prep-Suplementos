// src/features/supplements/services/supplements.service.ts

import { fetchAPI } from "@/config/api"
import type { Supplement } from "@/features/supplements/types/supplement"

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
}

export const supplementsService = new SupplementsService()
