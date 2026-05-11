import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservaService } from 'src/app/services/reserva.service';
import { AuthService } from 'src/app/services/auth.service';
import { TipoHabitacionService } from 'src/app/services/tipo-habitacion.service';

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

  constructor(
    private route: ActivatedRoute,
    private tipoHabitacionService: TipoHabitacionService,
    private reservaService: ReservaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.tipoHabitacionService.getById(id).subscribe({
      next: (data) => {
        this.tipoHabitacion = data;
      },
      error: () => {
        alert('Error cargando tipo de habitación');
      }
    });
  }

  reservar(): void {
    const huespedId = this.authService.getUsuarioId();

    if (!huespedId) {
      alert('Debes iniciar sesión');
      return;
    }

    if (!this.fechaInicio || !this.fechaFin) {
      alert('Selecciona fechas');
      return;
    }

    const data = {
      tipoHabitacionId: this.tipoHabitacion.id,
      huespedId: huespedId,
      cantidadPersonas: this.personas,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    };

    this.reservaService.crearReservaPorTipo(data).subscribe({
      next: (resp) => {
  alert(
    'Reserva creada correctamente. Habitación asignada: ' +
    resp.habitacionCodigo
  );
},
      error: (err) => {
        alert(err.error?.err || 'Error al reservar');
      }
    });
  }
}