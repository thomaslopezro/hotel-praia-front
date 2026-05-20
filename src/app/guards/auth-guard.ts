// guards/auth.guard.ts

import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const expectedRol = route.data['expectedRol'];
    const currentUser = this.authService.getCurrentUser();

    // =========================
    // NO ESTÁ LOGUEADO
    // =========================
    if (!this.authService.estaLogueado()) {

      console.log('Usuario no autenticado');

      this.router.navigate(['/login']);
      return false;
    }

    // =========================
    // SOLO REQUIERE LOGIN
    // =========================
    if (!expectedRol) {

      console.log('Ruta protegida: usuario autenticado');
      return true;
    }

    // =========================
    // VALIDAR ROL
    // =========================
    if (currentUser?.rol !== expectedRol) {

      console.log(
        `Acceso denegado. Rol esperado: ${expectedRol} | Rol actual: ${currentUser?.rol}`
      );

      // OPERADOR
      if (currentUser?.rol === 'OPERADOR') {

        this.router.navigate(['/menu-admin']);

      // CLIENTE
      } else if (currentUser?.rol === 'CLIENTE') {

        this.router.navigate(['/']);

      // ADMIN
      } else if (currentUser?.rol === 'ADMIN') {

        this.router.navigate(['/habitaciones/admin']);

      } else {

        this.router.navigate(['/login']);
      }

      return false;
    }

    // =========================
    // ACCESO CORRECTO
    // =========================
    console.log('Acceso autorizado');

    return true;
  }
}