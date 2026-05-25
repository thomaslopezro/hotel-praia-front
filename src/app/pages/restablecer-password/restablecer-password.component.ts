import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-restablecer-password',
  templateUrl: './restablecer-password.component.html'
})
export class RestablecerPasswordComponent implements OnInit {
  token = '';
  nuevaPassword = '';
  confirmacion = '';
  mostrarPassword = false;
  cargando = false;
  exito = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.error = 'No se recibió un token válido. Solicita un nuevo enlace.';
    }
  }

  guardar(): void {
    this.error = '';
    if (!this.token) {
      this.error = 'Token ausente.';
      return;
    }
    if (!this.nuevaPassword || this.nuevaPassword.length < 4) {
      this.error = 'La contraseña debe tener al menos 4 caracteres.';
      return;
    }
    if (this.nuevaPassword !== this.confirmacion) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }
    this.cargando = true;
    this.authService.restablecerPassword(this.token, this.nuevaPassword).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = true;
      },
      error: (err) => {
        this.cargando = false;
        this.error = err?.message || 'No se pudo actualizar la contraseña.';
      }
    });
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }
}
