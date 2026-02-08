import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

/**
 * Guard para proteger rutas que requieren autenticación
 * Redirige a /login si el usuario no está autenticado
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirige a login guardando la URL a la que intentaba acceder
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

/**
 * Guard para rutas públicas (login, register)
 * Redirige a /home si el usuario YA está autenticado
 * Previene acceso a login/register cuando ya hay sesión activa
 */
export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Usuario ya autenticado, redirige a home
  router.navigate(['/home']);
  return false;
};
