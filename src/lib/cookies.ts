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