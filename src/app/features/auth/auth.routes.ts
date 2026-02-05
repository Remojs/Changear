import { Routes } from '@angular/router'; //Import de Routes desde angular/router

export const AUTH_ROUTES: Routes = [ //Creo un array de rutas para el feature de AUTH
  {
    path: 'login', //creo la ruta /login
    loadComponent: () => //lazy loading del componente LoginComponent
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register', //creo la ruta /register
    loadComponent: () =>  //lazy loading del componente RegisterComponent
      import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    redirectTo: 'login', //redirecciono la ruta vacía a /login
    pathMatch: 'full'
  }
];
