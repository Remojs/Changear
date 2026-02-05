import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { 
  LoginResponseDTO, 
  RegisterResponseDTO, 
  ErrorResponseDTO 
} from '../models/auth.dto';
import { LoginCredentials, RegisterData } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //Login endpoint - POST /account/login
  login(credentials: LoginCredentials): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(
      `${this.apiUrl}/account/login`,
      credentials
    ).pipe(
      catchError(this.handleError)
    );
  }

  //Register endpoint - POST /account/register
  register(userData: RegisterData): Observable<RegisterResponseDTO> {
    // Mapeo de campo phone a phone_number para backend
    const payload = {
      ...userData,
      phone_number: userData.phone
    };

    return this.http.post<RegisterResponseDTO>(
      `${this.apiUrl}/account/register`,
      payload
    ).pipe(
      catchError(this.handleError)
    );
  }

   //Manejo de errores HTTP
   //Convierte HttpErrorResponse en un formato manejable
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      const errorResponse = error.error as ErrorResponseDTO;
      
      if (errorResponse?.errors) {
        // Errores de validación del backend
        const validationErrors = Object.entries(errorResponse.errors)
          .map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(', ')}`;
          })
          .join('\n');
        errorMessage = validationErrors;
      } else if (errorResponse?.message) {
        errorMessage = errorResponse.message;
      } else if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
      } else {
        errorMessage = `Error ${error.status}: ${error.statusText}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
