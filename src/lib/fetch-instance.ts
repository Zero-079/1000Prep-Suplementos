// src/lib/fetch-instance.ts
"use client"

import axios from "axios"

// Instancia de axios para usar en server-side data fetching
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export const fetchInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

// Wrapper para fetch que puede usar cookies del browser automáticamente
export async function serverFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    credentials: "include", // Envía cookies automáticamente
  })

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`)
    throw error
  }

  return response.json()
}

/**
 * Función para obtener el usuario actual desde el servidor
 * Usada en Server Components o inicialización
 */
export async function fetchCurrentUser() {
  try {
    const response = await serverFetch<{ user?: { id: string; email: string; name: string; role: string; avatarUrl?: string } }>("/auth/me")
    return response.user || null
  } catch {
    return null
  }
}