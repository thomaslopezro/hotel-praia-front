import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html'
})
export class RecuperarPasswordComponent {
  correo = '';
  cargando = false;
  mensaje = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  enviar(): void {
    this.mensaje = '';
    this.error = '';
    if (!this.correo || !this.correo.includes('@')) {
      this.error = 'Ingresa un correo válido.';
      return;
    }
    this.cargando = true;
    this.authService.solicitarRecuperacion(this.correo.trim()).subscribe({
      next: (resp) => {
        this.cargando = false;
        this.mensaje = resp?.ok || 'Si el correo está registrado, te enviamos un enlace.';
      },
      error: (err) => {
        this.cargando = false;
        this.error = err?.message || 'No se pudo procesar la solicitud.';
      }
    });
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }
}
