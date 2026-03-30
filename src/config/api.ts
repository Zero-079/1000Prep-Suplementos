// src/config/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010'
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
    'Content-Type': 'application/json',
    ...options.headers,
  };
    
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData.message || `API error: ${response.status} ${response.statusText}`
    );
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }
  
  return response.json();
}
