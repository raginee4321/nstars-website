export interface GalleryImage {
  id: number;
  image_path: string;
  description: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  role: 'admin' | 'user';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Add 'qrscanner' to the ViewType
export type ViewType = 'home' | 'gallery' | 'login' | 'admin' | 'qrscanner';
