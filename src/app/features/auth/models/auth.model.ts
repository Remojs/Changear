// Domain Models - Entidades del dominio de la aplicación

export interface LoginCredentials {
  identifier: string; // email o username
  password: string;
}

export interface RegisterData {
  name: string;
  user: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  phone_number?: string; // Alias para compatibilidad con backend
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}
