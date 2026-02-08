import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

/**
 * Interceptor de autenticación
 * 
 * Funcionalidad:
 * 1. Inyecta automáticamente el token JWT en el header Authorization de todas las peticiones
 * 2. Maneja errores 401 (Unauthorized) y 403 (Forbidden) globalmente
 * 3. Redirige a /login cuando el token expira o es inválido
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtener el token del servicio
  const token = authService.getToken();

  // Si existe token, clonar la request y agregar el header Authorization
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Continuar con la request y manejar errores
  return next(req).pipe(
    catchError((error) => {
      // Manejar errores de autenticación
      if (error.status === 401 || error.status === 403) {
        // Token expirado o inválido
        authService.clearAuthData();
        router.navigate(['/login'], {
          queryParams: {
            returnUrl: router.url,
            reason: 'session-expired'
          }
        });
      }
      
      return throwError(() => error);
    })
  );
};

/**
 * Interceptor de logging (opcional - útil para debug)
 * Registra todas las peticiones HTTP en consola
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  
  console.log(`[HTTP] ${req.method} ${req.url}`);
  
  return next(req).pipe(
    catchError((error) => {
      const elapsed = Date.now() - startTime;
      console.error(`[HTTP ERROR] ${req.method} ${req.url} - ${error.status} (${elapsed}ms)`);
      return throwError(() => error);
    })
  );
};
