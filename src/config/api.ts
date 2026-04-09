// src/config/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
export const API_TIMEOUT = 5000

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
}

export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  // Filtrar undefined values de los params
  const filteredParams = options.params
    ? Object.fromEntries(
        Object.entries(options.params).filter(([_, v]) => v !== undefined)
      )
    : undefined;

  const url = filteredParams && Object.keys(filteredParams).length > 0
    ? `${API_BASE_URL}${endpoint}?${new URLSearchParams(filteredParams as Record<string, string>)}`
    : `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    ...options.headers,
  };
  
  // Solo agregar Content-Type si NO es FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  console.log(`[fetchAPI] ${options.method || 'GET'} ${url}`)
  if (options.body instanceof FormData) {
    console.log(`[fetchAPI] FormData:`, Array.from(options.body.entries()).map(([k, v]) => [k, v instanceof File ? { name: v.name, size: v.size, type: v.type } : v]))
  }
     
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
    
  if (!response.ok) {
    // Intentar leer el cuerpo del error
    let errorDetail = ''
    try {
      const errorText = await response.text()
      errorDetail = errorText
      console.log(`[fetchAPI] Error body:`, errorText)
    } catch (e) {}
    
    const errorMessage = errorDetail ? `API error: ${response.status} - ${errorDetail}` : `API error: ${response.status} ${response.statusText}`;
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }
  
  // Try to parse JSON, but handle cases where response might not be valid JSON
  try {
    const text = await response.text();
    if (!text) {
      return {} as T;
    }
    return JSON.parse(text) as T;
  } catch (e) {
    // If parsing fails, return empty object
    return {} as T;
  }
}
