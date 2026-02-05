import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterData } from '../../models/auth.model';
import { AuthBackgroundComponent } from '../../../../shared/components/auth-background/auth-background.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthBackgroundComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  
  // UI State con Signals
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      user: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    // Validación de contraseñas
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    if (this.registerForm.invalid) {
      this.errorMessage.set('Por favor, completa todos los campos correctamente');
      return;
    }

    this.isLoading.set(true);

    const registerData: RegisterData = {
      name: this.registerForm.value.name,
      user: this.registerForm.value.user,
      email: this.registerForm.value.email,
      phone: this.registerForm.value.phone,
      password: this.registerForm.value.password,
      password_confirmation: this.registerForm.value.confirmPassword
    };

    this.authService.register(registerData).subscribe({
      next: (result) => {
        console.log('Registro exitoso:', result);
        this.successMessage.set(result.message || '¡Cuenta creada con éxito! Por favor, verifica tu email.');
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error al registrar:', error);
        this.errorMessage.set(error.message || 'Error al crear la cuenta. Por favor, intenta de nuevo.');
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
