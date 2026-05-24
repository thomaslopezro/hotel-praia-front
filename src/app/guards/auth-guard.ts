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

    // ADMIN puede entrar a CUALQUIER ruta protegida (es superusuario).
    // Si no, las rutas admin con expectedRol:'OPERADOR' lo rechazan y
    // lo redirigen aqui mismo => loop infinito.
    if (currentUser?.rol === 'ADMIN') {
      return true;
    }

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