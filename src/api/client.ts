/**
 * Cliente HTTP centralizado para consumir la API
 * Compatible con Web, Neutralino y React Native
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.headers['Authorization'];
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    // Detectar si estamos en Neutralino
    const isNeutralino = typeof window !== 'undefined' && (window as any).__NL_OS !== undefined;

    try {
      let response: Response;

      if (isNeutralino) {
        // En Neutralino usamos fetch nativo de Neutralino si está disponible
        const NL = (window as any).Neutralino;
        if (NL?.filesystem?.readFile) {
          const result = await this.neutralinoRequest<T>(endpoint, options);
          return result;
        }
      }

      response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error HTTP ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error de conexión';
      console.error(`[API Error] ${endpoint}:`, message);

      // Si no hay conexión, intentar con datos locales (fallback)
      const fallbackData = await this.getFallbackData<T>(endpoint);
      if (fallbackData) {
        return { success: true, data: fallbackData, message: 'Modo offline - datos locales' };
      }

      throw new Error(message);
    }
  }

  private async neutralinoRequest<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    const NL = (window as any).Neutralino;
    const url = `${this.baseUrl}${endpoint}`;

    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : undefined;

    // Usar Neutralino HTTP client
    const response = await NL.http.request(method, url, {
      headers: this.headers,
      body,
    });

    return { success: true, data: response.json() as T };
  }

  private async getFallbackData<T>(endpoint: string): Promise<T | null> {
    const fallbacks: Record<string, () => Promise<T>> = {};

    const key = endpoint.split('?')[0];
    if (fallbacks[key]) {
      return fallbacks[key]();
    }
    return null;
  }

  // Métodos HTTP
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url = `${endpoint}?${searchParams.toString()}`;
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
export default ApiClient;
