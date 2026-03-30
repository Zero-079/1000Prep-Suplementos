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
}

export const supplementsService = new SupplementsService()
