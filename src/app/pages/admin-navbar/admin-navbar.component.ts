import { Component } from '@angular/core';

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
}