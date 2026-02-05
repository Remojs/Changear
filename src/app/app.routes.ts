import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => 
      import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [publicGuard],
    loadComponent: () => 
      import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => 
      import('./pages/home/home.component').then(m => m.HomeComponent)
  }
];
