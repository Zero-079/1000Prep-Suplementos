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
    
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
  
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorData = {};
    let errorMessage = '';

    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json().catch(() => ({}));
      errorMessage = (errorData as any)?.message || '';
    } else {
      // El servidor devolvió HTML (probablemente página de error)
      const text = await response.text().catch(() => '');
      console.error('API Error - Response is not JSON:', response.status, text.substring(0, 500));
      errorMessage = `API error: ${response.status} ${response.statusText}`;
    }

    const error = new Error(
      errorMessage || `API error: ${response.status} ${response.statusText}`
    );
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }
  
  return response.json();
}
