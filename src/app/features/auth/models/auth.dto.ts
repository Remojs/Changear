// DTOs - Datos que vienen del backend

export interface LoginResponseDTO {
  message: string;
  data: {
    user: UserDTO;
    token?: string;
  };
}

export interface RegisterResponseDTO {
  message: string;
  data: {
    user: UserDTO;
    token?: string;
  };
}

export interface UserDTO {
  id: number;
  name: string;
  user: string;
  email: string;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ErrorResponseDTO {
  message?: string;
  errors?: Record<string, string | string[]>;
}
