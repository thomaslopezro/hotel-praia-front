import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaService } from 'src/app/services/reserva.service';
import { AuthService } from 'src/app/services/auth.service';
import { TipoHabitacionService } from 'src/app/services/tipo-habitacion.service';
import { PagoService } from 'src/app/services/pago.service';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.component.html',
  styleUrls: ['./reservar.component.scss']
})
export class ReservarComponent implements OnInit {

  tipoHabitacion: any;
  fechaInicio: string = '';
  fechaFin: string = '';
  personas: number = 1;

  // Estado de confirmacion (se muestra cuando la reserva se crea OK)
  reservaConfirmada: {
    habitacionCodigo: string;
    reservaId?: string;
    fechaInicio: string;
    fechaFin: string;
    personas: number;
  } | null = null;

  error: string = '';
  guardando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private tipoHabitacionService: TipoHabitacionService,
    private reservaService: ReservaService,
    private authService: AuthService,
    private router: Router,
    private pagoService: PagoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.tipoHabitacionService.getById(id).subscribe({
      next: (data) => {
        this.tipoHabitacion = data;
      },
      error: () => {
        this.error = 'Error cargando tipo de habitación';
      }
    });
  }

  reservar(): void {
    this.error = '';
    const huespedId = this.authService.getUsuarioId();

    if (!huespedId) {
      this.error = 'Debes iniciar sesión';
      return;
    }

    if (!this.fechaInicio || !this.fechaFin) {
      this.error = 'Selecciona las fechas';
      return;
    }

    // En lugar de crear la reserva directamente, iniciamos un pago en Stripe.
    // Cuando Stripe confirme el pago, /pago-exitoso llama a /api/pagos/reserva/confirmar
    // que es quien finalmente crea la reserva.
    this.guardando = true;
    this.pagoService.iniciarPagoReserva({
      tipoHabitacionId: this.tipoHabitacion.id,
      huespedId,
      cantidadPersonas: this.personas,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    }).subscribe({
      next: (resp) => {
        // Redirige al usuario a la pagina de checkout de Stripe
        window.location.href = resp.url;
      },
      error: (err) => {
        this.guardando = false;
        this.error = err?.error?.err || 'No se pudo iniciar el pago';
      }
    });
  }

  irAMisReservas(): void {
    this.router.navigate(['/mi-perfil']);
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
}
