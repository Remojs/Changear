import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { User } from '../../features/auth/models/auth.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <h1>Home - Ruta Protegida</h1>
      
      <button (click)="onLogout()" class="logout-btn">
        Cerrar Sesión
      </button>

      @if (user) {
        <div class="user-info">
          <p><strong>Nombre:</strong> {{ user.name }}</p>
          <p><strong>Username:</strong> {{ user.username }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          @if (user.phoneNumber) {
            <p><strong>Teléfono:</strong> {{ user.phoneNumber }}</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      margin-bottom: 1.5rem;
    }

    .logout-btn {
      padding: 0.5rem 1rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      margin-bottom: 1.5rem;
    }

    .logout-btn:hover {
      background: #dc2626;
    }

    .user-info {
      background: #f3f4f6;
      padding: 1.5rem;
      border-radius: 0.5rem;
    }

    .user-info p {
      margin: 0.5rem 0;
    }
  `]
})
export class HomeComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
