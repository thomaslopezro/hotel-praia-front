import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html'
})
export class VerificacionComponent implements OnInit {
  estado: 'cargando' | 'ok' | 'error' = 'cargando';
  mensaje = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.estado = 'error';
      this.mensaje = 'No se recibió un token de verificación.';
      return;
    }
    this.http.get<any>(`${environment.apiUrl}/api/auth/verificar?token=${encodeURIComponent(token)}`)
      .subscribe({
        next: (resp) => {
          this.estado = 'ok';
          this.mensaje = resp?.ok || 'Cuenta verificada correctamente.';
        },
        error: (err) => {
          this.estado = 'error';
          this.mensaje = err?.error?.err || 'No se pudo verificar la cuenta.';
        }
      });
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }
}
