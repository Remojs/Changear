import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthApi } from '../api/auth.api';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User 
} from '../models/auth.model';
import { UserDTO } from '../models/auth.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private authApi: AuthApi) {}

  //Login de usuario - Transforma el DTO del backend al modelo de dominio
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.authApi.login(credentials).pipe(
      map(response => ({
        message: response.message,
        user: this.mapUserDTOToDomain(response.data.user),
        token: response.data.token
      }))
    );
  }

  //Registro de usuario - Transforma el DTO del backend al modelo de dominio
  register(userData: RegisterData): Observable<AuthResponse> {
    // Validación de contraseñas (opcional, ya está en el componente)
    if (userData.password !== userData.password_confirmation) {
      throw new Error('Las contraseñas no coinciden');
    }

    return this.authApi.register(userData).pipe(
      map(response => ({
        message: response.message,
        user: this.mapUserDTOToDomain(response.data.user),
        token: response.data.token
      }))
    );
  }

   //Mapeo de UserDTO (backend) a User (dominio)
   //Centraliza la transformación de datos del backend al modelo de dominio
  private mapUserDTOToDomain(dto: UserDTO): User {
    return {
      id: dto.id,
      name: dto.name,
      username: dto.user,
      email: dto.email,
      phoneNumber: dto.phone_number,
      createdAt: dto.created_at ? new Date(dto.created_at) : undefined,
      updatedAt: dto.updated_at ? new Date(dto.updated_at) : undefined
    };
  }

   //Guardar datos de autenticación en localStorage
  saveAuthData(user: User, token?: string): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  //Limpiar datos de autenticación
  clearAuthData(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
  }

  //Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  //Obtener usuario actual desde localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  //Obtener token actual desde localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
