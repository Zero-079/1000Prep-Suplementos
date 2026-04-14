/**
 * Cookie helper functions
 * Lee el access_token desde document.cookie (donde el backend establece las cookies)
 */

/**
 * Obtiene el valor de una cookie por nombre
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    // Server-side: no hay cookies
    return null
  }
  
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=')
    if (cookieName === name) {
      return decodeURIComponent(cookieValue)
    }
  }
  return null
}

/**
 * Establece una cookie con opciones de configuración
 */
function setCookie(name: string, value: string, maxAgeSeconds: number = 60 * 60 * 24 * 7): void {
  if (typeof document === 'undefined') return
  
  const expires = new Date(Date.now() + maxAgeSeconds * 1000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

/**
 * Elimina una cookie
 */
function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

/**
 * Obtiene el access_token de la cookie
 * El backend establece esta cookie en el login
 */
export function getAccessToken(): string | null {
  return getCookie('access_token')
}

/**
 * Obtiene el refresh_token de la cookie (si existe)
 */
export function getRefreshToken(): string | null {
  return getCookie('refreshToken')
}

/**
 * Guarda el refresh_token en cookie
 */
export function setRefreshToken(token: string): void {
  setCookie('refreshToken', token, 60 * 60 * 24 * 7) // 7 días
}

/**
 * Elimina el refresh_token de la cookie
 */
export function deleteRefreshToken(): void {
  deleteCookie('refreshToken')
}