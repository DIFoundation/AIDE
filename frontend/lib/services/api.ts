interface ApiResponse<T = any> {
  data: T | null;
  error?: string;
  status: number;
}

class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aide-backend-qj4f.onrender.com/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          data: null,
          error: data.message || 'An error occurred',
          status: response.status,
        };
      }

      return { data, status: response.status };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        data: null,
        error: 'Network error occurred',
        status: 500,
      };
    }
  }

  // Emergency endpoints
  public async getEmergencyProcedures(type: string): Promise<ApiResponse<string[]>> {
    return this.request<string[]>(`/emergency/${type}`);
  }

  public async getNearbyShelters(lat: number, lng: number, radius: number = 5000): Promise<ApiResponse> {
    return this.request('/shelters/nearby', {
      method: 'POST',
      body: JSON.stringify({ lat, lng, radius }),
    });
  }

  public async getHospitals(lat?: number, lng?: number): Promise<ApiResponse> {
    const endpoint = lat && lng 
      ? `/hospitals/nearby?lat=${lat}&lng=${lng}` 
      : '/hospitals';
    
    return this.request(endpoint);
  }

  // Add more API methods as needed
}

export const apiService = new ApiService();
