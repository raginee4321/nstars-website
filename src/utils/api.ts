import { GalleryImage, ApiResponse, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

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

      const data = (await response.json()) as ApiResponse<T>;
      return data;
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
      const data = (await response.json()) as ApiResponse<GalleryImage>;
      return data;
    } catch (error: unknown) {
      console.error('Upload failed:', error);
      return {
        success: false,
        data: undefined,
        message: error instanceof Error ? error.message : 'Upload failed',
      } as ApiResponse<GalleryImage>;
    }
  }

  async deleteGalleryImage(imageId: number): Promise<ApiResponse<null>> {
    // Provide the generic parameter so TS knows the shape
    return this.request<null>(`/admin/gallery/${imageId}`, {
      method: 'DELETE',
    });
  }

  async login(username: string, password: string): Promise<ApiResponse<User>> {
    return this.request<User>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }
}

export const api = new ApiService();
