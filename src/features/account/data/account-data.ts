// ── Types ───────────────────────────────────────────────────────────────────
export type SectionId = "info" | "addresses" | "password"

export interface Section {
  id: SectionId
  label: string
  iconName: "User" | "MapPin" | "Lock"
}

// ── Data ────────────────────────────────────────────────────────────────────
export const SECTIONS: Section[] = [
  { id: "info", label: "Información de cuenta", iconName: "User" },
  { id: "addresses", label: "Direcciones", iconName: "MapPin" },
  { id: "password", label: "Cambiar contraseña", iconName: "Lock" },
]
