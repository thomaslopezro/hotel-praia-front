import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reserva } from '../../modelo/reserva';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reservas-admin',
  templateUrl: './reservas-admin.component.html',
  styleUrls: ['./reservas-admin.component.scss']
})
export class ReservasAdminComponent implements OnInit {

  reservas: Reserva[] = [];
  cargando = true;
  error = '';
  okMessage = '';
  errMessage = '';

  constructor(
    private reservaService: ReservaService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  esOperador(): boolean {
    return this.authService.esOperador();
  }

  cargarReservas(): void {
    this.cargando = true;
    this.reservaService.getAll().subscribe({
      next: (data) => {
        this.reservas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando reservas:', err);
        this.error = 'Error al cargar las reservas';
        this.cargando = false;
      }
    });
  }

  get totalConfirmadas(): number {
    return this.reservas.filter(r => r.estado === 'CONFIRMADA').length;
  }

  get totalPendientes(): number {
    return this.reservas.filter(r => r.estado === 'PENDIENTE').length;
  }

  get totalCanceladas(): number {
    return this.reservas.filter(r => r.estado === 'CANCELADA').length;
  }

  getEstadoClass(estado: string | undefined): string {
    switch (estado) {
      case 'CONFIRMADA': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'PENDIENTE':  return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'CANCELADA':  return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:           return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  }

  goToCreate(): void {
    this.router.navigate(['/reservas/admin/nuevo']);
  }

  goToEdit(id?: number): void {
    if (id) this.router.navigate(['/reservas/admin/editar', id]);
  }

  eliminarReserva(id?: number): void {
    if (!id) return;
    if (!confirm('¿Eliminar esta reserva?')) return;

    this.reservaService.delete(id).subscribe({
      next: () => {
        this.okMessage = 'Reserva eliminada correctamente.';
        this.errMessage = '';
        this.cargarReservas();
        setTimeout(() => this.okMessage = '', 3000);
      },
      error: (err) => {
        const status = err.status || 0;
        if (status === 409 || status === 400) {
          this.errMessage = 'No se puede eliminar esta reserva porque tiene datos asociados.';
        } else if (status === 404) {
          this.errMessage = 'La reserva no fue encontrada. Recarga la página.';
        } else {
          this.errMessage = err.error?.message || 'Error al eliminar la reserva.';
        }
        this.okMessage = '';
        setTimeout(() => this.errMessage = '', 5000);
      }
    });
  }

finalizandoId: number | null = null;

finalizarReserva(reserva: Reserva): void {
    if (!reserva.id) return;
    
    if (!confirm(`¿Finalizar reserva #${reserva.id} para ${reserva.huesped?.nombre} ${reserva.huesped?.apellido}?\n\nEsta acción marcará la reserva como FINALIZADA y liberará la habitación.`)) {
        return;
    }
    
    this.finalizandoId = reserva.id;
    
    this.reservaService.finalizarReserva(reserva.id).subscribe({
        next: () => {
            this.okMessage = `✅ Reserva #${reserva.id} finalizada correctamente`;
            this.errMessage = '';
            this.finalizandoId = null;
            this.cargarReservas();
            setTimeout(() => this.okMessage = '', 4000);
        },
        error: (err) => {
            this.finalizandoId = null;
            const mensajeError = err.error?.err || 'Error al finalizar la reserva';
            if (mensajeError.includes('deuda')) {
                this.errMessage = mensajeError;
            } else {
                this.errMessage = mensajeError;
            }
            this.okMessage = '';
            setTimeout(() => this.errMessage = '', 6000);
        }
    });
}



}