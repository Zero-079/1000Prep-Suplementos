// src/features/supplements/types/supplement.ts

export type SupplementCategory =
  | "ALL"
  | "PROTEIN"
  | "VITAMINS"
  | "CREATINE"
  | "PRE_WORKOUT"
  | "FAT_BURNER"
  | "AMINO_ACIDS"

export type SupplementCategoryFilter = SupplementCategory

export interface SupplementBrand {
  id: string
  name: string
  logoUrl: string | null
}

export interface SupplementNutrition {
  id: string
  supplementId: string
  servingsPerContainer: number
  calories: number
  protein: string
  carbs: string
  fat: string
  otherNutrients: Record<string, number> | null
}

export interface SupplementImage {
  id: string
  url: string
}

export interface Supplement {
  id: string
  brandId: string
  name: string
  description: string
  category: SupplementCategory
  price: string
  subscriberPrice: string
  stock: number
  isActive: boolean
  usageInstructions: string
  servingSize: string
  createdAt: string
  updatedAt: string
  brand: SupplementBrand
  images: SupplementImage[]
  nutrition: SupplementNutrition | null
  _count: {
    reviews: number
  }
}

export interface SupplementCartItem {
  supplement: Supplement
  quantity: number
}
