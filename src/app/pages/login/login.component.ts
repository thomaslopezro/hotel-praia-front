import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  iniciarSesion(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { correo, contrasena } = this.loginForm.value;

    this.authService.login(correo, contrasena).subscribe({
      next: (response: AuthResponse) => {
        console.log('Respuesta del login:', response); // 👈 DEBUG: ver qué llega
        
        // 👇 IMPORTANTE: Verificar el rol correctamente
        if (response.rol === 'ADMIN') {
          console.log('Es administrador, redirigiendo a /habitaciones/admin');
          this.router.navigate(['/habitaciones/admin']);
        } else if (response.rol === 'OPERADOR') {
          console.log('Es operador, redirigiendo a /menu-admin');
          this.router.navigate(['/menu-admin']);
        } else {
          console.log('Es cliente, redirigiendo a /');
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Error de login:', err);
        this.error = err?.error?.err || err?.error?.message || 'Credenciales inválidas';
      }
    });
  }
}