// guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRol = route.data['expectedRol'];
    const currentUser = this.authService.getCurrentUser();
    
    // No está logueado
    if (!this.authService.estaLogueado()) {
      this.router.navigate(['/login']);
      return false;
    }
    
    // Si no se espera un rol específico, solo requiere login
    if (!expectedRol) {
      return true;
    }
    
    // Verificar si tiene el rol correcto
    if (currentUser?.rol !== expectedRol) {
      // Redirigir según el rol que tiene
      if (currentUser?.rol === 'OPERADOR') {
        this.router.navigate(['/menu-admin']);
      } else if (currentUser?.rol === 'CLIENTE') {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }
    
    return true;
  }
}