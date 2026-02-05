import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../models/auth.model';
import { AuthBackgroundComponent } from '../../../../shared/components/auth-background/auth-background.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthBackgroundComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  
  // UI State con Signals
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.loginForm.invalid) {
      this.errorMessage.set('Por favor, completa todos los campos');
      return;
    }

    this.isLoading.set(true);

    const credentials: LoginCredentials = {
      identifier: this.loginForm.value.identifier,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (result) => {
        console.log('Login exitoso:', result);
        
        // Guardar datos del usuario
        this.authService.saveAuthData(result.user, result.token);
        
        this.successMessage.set(result.message || '¡Login exitoso!');
        
        // Redirigir al home después de 1 segundo
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        this.errorMessage.set(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
