import { Component } from '@angular/core';

@Component({
  selector: 'app-operator-navbar',
  templateUrl: './operator-navbar.component.html',
  styleUrls: ['./operator-navbar.component.scss']
})
export class OperatorNavbarComponent {
  navLinks = [
    { label: 'Panel operador', route: '/menu-admin' },
    { label: 'Reservas', route: '/reservas/admin' },
    { label: 'Servicios', route: '/operador/servicios-cuenta' }
  ];
}
