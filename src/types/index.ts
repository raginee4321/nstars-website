export interface Event {
  id: string | number;
  title: string;
  date: string;
  description: string;
}

export interface GalleryImage {
  id: string | number;
  description: string;
  image_path: string;
}

export interface User {
  id?: string | number;
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