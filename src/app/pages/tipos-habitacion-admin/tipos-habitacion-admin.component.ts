import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipoHabitacion } from '../../modelo/tipo-habitacion';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tipos-habitacion-admin',
  templateUrl: './tipos-habitacion-admin.component.html',
  styleUrls: ['./tipos-habitacion-admin.component.scss']
})
export class TiposHabitacionAdminComponent implements OnInit {
  rooms: TipoHabitacion[] = [];

  constructor(
    private tipoHabitacionService: TipoHabitacionService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  esOperador(): boolean {
    return this.authService.esOperador();
  }

  loadRooms(): void {
    this.tipoHabitacionService.getAll().subscribe({
      next: (data) => this.rooms = data,
      error: (err) => console.error('Error cargando habitaciones:', err)
    });
  }

  goToCreate(): void {
    this.router.navigate(['/tipos-habitacion/nuevo']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/tipos-habitacion/editar', id]);
  }

  deleteRoom(id: number): void {
    const ok = confirm('¿Eliminar este tipo de habitación?');
    if (ok) {
      this.tipoHabitacionService.delete(id).subscribe({
        next: () => this.loadRooms(), // 👈 recarga la lista cuando el backend confirma
        error: (err) => {
          // 👇 muestra el mensaje de error si hay habitaciones asignadas (409 CONFLICT)
          if (err.status === 409) {
            alert(err.error?.err || 'No se puede eliminar este tipo de habitación.');
          } else {
            console.error('Error eliminando:', err);
          }
        }
      });
    }
  }
}