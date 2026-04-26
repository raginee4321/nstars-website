import { GalleryImage, ApiResponse, User } from '../types';

// Ensure API_BASE_URL always ends with /api to avoid 405 errors on Vercel
const base = import.meta.env.VITE_API_BASE_URL || '/api';
export const API_BASE_URL = base.endsWith('/api') ? base : `${base}/api`.replace('//api', '/api');

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Safely merge headers (options.headers may be HeadersInit, object, or undefined)
      const mergedHeaders = new Headers(options.headers ?? {});
      // Set default Content-Type for JSON requests only if not already provided
      if (!mergedHeaders.has('Content-Type')) {
        mergedHeaders.set('Content-Type', 'application/json');
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: mergedHeaders,
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Failed to parse API response:', responseText);
        return {
          success: false,
          data: undefined,
          message: `Failed to parse response. Status: ${response.status}`,
        } as ApiResponse<T>;
      }

      // Handle both wrapped { success, data } and raw responses
      if (responseData && typeof responseData === 'object' && 'success' in responseData) {
        return responseData as ApiResponse<T>;
      }

      // If not wrapped, construct a success response with the raw data
      return {
        success: response.ok,
        data: responseData as T,
        message: response.ok ? undefined : 'Request failed',
      };
    } catch (error: unknown) {
      console.error('API request failed:', error);
      return {
        success: false,
        data: undefined,
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse<T>;
    }
  }

  async getGalleryImages(): Promise<GalleryImage[]> {
    const response = await this.request<GalleryImage[]>('/gallery');
    // If success and data present return it, otherwise return empty array
    return response.success ? response.data ?? [] : [];
  }

  async uploadGalleryImage(formData: FormData): Promise<ApiResponse<GalleryImage>> {
    try {
      // For FormData uploads we intentionally do NOT set Content-Type (browser will set boundary)
      const response = await fetch(`${API_BASE_URL}/admin/gallery/upload`, {
        method: 'POST',
        body: formData,
      });
      const responseText = await response.text();
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        throw new Error(`Failed to parse upload response. Status: ${response.status}`);
      }
      return data as ApiResponse<GalleryImage>;
    } catch (error: unknown) {
      console.error('Upload failed:', error);
      return {
        success: false,
        data: undefined,
        message: error instanceof Error ? error.message : 'Upload failed',
      } as ApiResponse<GalleryImage>;
    }
  }

  async deleteGalleryImage(imageId: string): Promise<ApiResponse<null>> {
    // Provide the generic parameter so TS knows the shape
    return this.request<null>(`/admin/gallery/${imageId}`, {
      method: 'DELETE',
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
}

export const api = new ApiService();
