export interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

export interface GalleryImage {
  id: number;
  description: string;
  image_path: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  phone?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}