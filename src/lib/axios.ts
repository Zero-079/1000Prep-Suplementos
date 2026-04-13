/**
 * Axios client con interceptor de refresh token
 * Maneja automáticamente la renovación de tokens y reintentos
 */

import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, getRefreshToken } from './cookies'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

/**
 * Estado global para manejar el refresh token
 * Evita múltiples refresh simultáneos
 */
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

/**
 * Procesa la cola de requests fallidos
 * @param error - Error que causó el failure (null si el refresh fue exitoso)
 */
const processQueue = (error: AxiosError | null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(undefined)
    }
  })
  failedQueue = []
}

/**
 * Crea la instancia de axios con interceptores
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Importante para cookies
})

/**
 * Interceptor de request: agrega Authorization header
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Helper para verificar si estamos en una ruta pública
 * No intentar refresh si ya estamos en login/register o rutas públicas
 */
function isPublicRoute(): boolean {
  if (typeof window === 'undefined') return false
  const path = window.location.pathname
  return path === '/login' || path === '/registro' || path === '/'
}

/**
 * Interceptor de response: maneja 401 y refresh token
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    console.log('[Axios Interceptor] Error:', error.response?.status, originalRequest?.url)

    // Solo manejar errores 401 que no sean el endpoint de refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest.url?.includes('/auth/refresh')) {
      // Verificar si hay refresh token disponible
      const refreshToken = getRefreshToken()
      console.log('[Axios Interceptor] Refresh token available:', !!refreshToken)

      // Si no hay refresh token y estamos en ruta pública, rechazar sin redirect
      if (!refreshToken && isPublicRoute()) {
        console.log('[Axios Interceptor] No refresh token and on public route, rejecting without redirect')
        processQueue(error)
        return Promise.reject(error)
      }

      // Evitar loops infinitos
      if (originalRequest._retry) {
        console.log('[Axios Interceptor] Retry flag set, rejecting')
        processQueue(error)
        // Solo hacer redirect si NO estamos en una ruta pública
        if (!isPublicRoute() && typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }

      if (isRefreshing) {
        console.log('[Axios Interceptor] Already refreshing, waiting in queue')
        // Ya hay un refresh en progreso, esperar en cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      // Marcar como reintento y comenzar refresh
      originalRequest._retry = true
      isRefreshing = true

      console.log('[Axios Interceptor] Attempting refresh token...')

      try {
        // Llamar al endpoint de refresh
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })
        console.log('[Axios Interceptor] Refresh success:', refreshResponse.data)

        // Refresh exitoso, procesar cola
        processQueue(null)

        // Reintentar request original con el nuevo token
        return axiosInstance(originalRequest)
      } catch (refreshError: any) {
        console.log('[Axios Interceptor] Refresh failed:', refreshError.response?.status, refreshError.response?.data)
        // Refresh falló, rechazar cola
        processQueue(refreshError as AxiosError)

        // Solo hacer redirect si NO estamos en una ruta pública
        if (!isPublicRoute() && typeof window !== 'undefined') {
          window.location.href = '/login'
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Para otros errores (403, 500, etc.), rechazar directamente
    // Pero también hacer redirect para 403 solo si no estamos en ruta pública
    if (error.response?.status === 403 && !isPublicRoute() && typeof window !== 'undefined') {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default axiosInstance