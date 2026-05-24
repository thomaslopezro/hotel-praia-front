import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent {
  navLinks = [
    { label: 'Habitaciones',        route: '/habitaciones/admin' },
    { label: 'Tipos de Habitación', route: '/tipos-habitacion' },
    { label: 'Servicios',           route: '/servicios/admin' },
    { label: 'Reservas',            route: '/reservas/admin' },
    { label: 'Operadores',          route: '/operadores/admin' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}