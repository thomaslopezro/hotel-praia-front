import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-operator-header',
  templateUrl: './operator-header.component.html'
})
export class OperatorHeaderComponent {
  fechaActual: Date = new Date();
  operadorNombre: string = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getCurrentUser() as any;
    if (user) {
      this.operadorNombre =
        user.nombre ||
        (user.correo || user.email || '').split('@')[0] ||
        'operador';
    } else {
      // Fallback si el subject esta vacio (despues de refresh)
      const correo = localStorage.getItem('operadorCorreo') || localStorage.getItem('correo') || '';
      this.operadorNombre = correo.split('@')[0] || 'operador';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
