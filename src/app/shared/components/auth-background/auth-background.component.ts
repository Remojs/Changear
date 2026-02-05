import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente reutilizable de background animado
 * Usado en páginas de autenticación (Login, Register)
 * 
 * @example
 * <app-auth-background 
 *   [backgroundColor]="'#f9fafb'" 
 *   [orb1Color]="'#fed7aa'" 
 *   [orb2Color]="'#fde047'">
 * </app-auth-background>
 */
@Component({
  selector: 'app-auth-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="background" [style.background-color]="backgroundColor"></div>
    <div class="orb orb1" [style.background-color]="orb1Color"></div>
    <div class="orb orb2" [style.background-color]="orb2Color"></div>
  `,
  styleUrls: ['./auth-background.component.css']
})
export class AuthBackgroundComponent {
  @Input() backgroundColor: string = '#f9fafb';
  @Input() orb1Color: string = '#fed7aa';
  @Input() orb2Color: string = '#fde047';
}
