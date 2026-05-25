import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagoService } from '../../services/pago.service';

@Component({
  selector: 'app-pago-exitoso',
  templateUrl: './pago-exitoso.component.html'
})
export class PagoExitosoComponent implements OnInit {
  estado: 'cargando' | 'ok' | 'error' = 'cargando';
  mensaje = '';
  detalles: any = null;
  tipo: 'reserva' | 'servicios' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pagoService: PagoService
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    const tipo = this.route.snapshot.queryParamMap.get('tipo') as ('reserva' | 'servicios' | null);

    if (!sessionId || !tipo) {
      this.estado = 'error';
      this.mensaje = 'Falta información del pago.';
      return;
    }
    this.tipo = tipo;

    const obs = tipo === 'reserva'
      ? this.pagoService.confirmarPagoReserva(sessionId)
      : this.pagoService.confirmarPagoServicios(sessionId);

    obs.subscribe({
      next: (resp) => {
        this.estado = 'ok';
        this.detalles = resp;
        this.mensaje = resp?.ok || 'Pago procesado correctamente.';
      },
      error: (err) => {
        this.estado = 'error';
        this.mensaje = err?.error?.err || 'No se pudo confirmar el pago.';
      }
    });
  }

  irAMisReservas(): void {
    this.router.navigate(['/mi-perfil']);
  }

  irAReservas(): void {
    this.router.navigate(['/reservas/admin']);
  }

  irAlInicio(): void {
    this.router.navigate(['/']);
  }
}
