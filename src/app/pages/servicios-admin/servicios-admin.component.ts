import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Servicio } from '../../modelo/servicio';
import { ServiciosService } from '../../services/servicios.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-servicios-admin',
  templateUrl: './servicios-admin.component.html',
})
export class ServiciosAdminComponent implements OnInit {
  servicios: Servicio[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private serviciosService: ServiciosService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadServicios();
  }

  esOperador(): boolean {
    return this.authService.esOperador();
  }

  loadServicios(): void {
    this.serviciosService.getAll().subscribe({
      next: (data) => (this.servicios = data),
      error: (err) => console.error('Error cargando servicios:', err),
    });
  }

  goToCreate(): void {
    this.router.navigate(['/servicios/admin/nuevo']);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/servicios/admin/editar', id]);
  }

  deleteServicio(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este servicio?')) return;
    
    this.serviciosService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Servicio eliminado correctamente';
        this.loadServicios();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Error eliminando:', err);
        
        // Detectar si el error es por asociación a reserva
        const errorMessage = err.error?.message || err.message || '';
        const statusCode = err.status || 0;
        
        // Posibles mensajes de error del backend
        if (statusCode === 409 || 
            statusCode === 400 || 
            errorMessage.toLowerCase().includes('reserva') || 
            errorMessage.toLowerCase().includes('asociado') ||
            errorMessage.toLowerCase().includes('dependencia') ||
            errorMessage.toLowerCase().includes('detalle_reserva')) {
          this.errorMessage = 'Este servicio no puede ser eliminado porque está vinculado a una o más reservas activas. Para eliminarlo, primero debes remover todas las reservas que lo utilizan.';
        } else {
          this.errorMessage = err.error?.message || 'Error al eliminar el servicio. Intenta de nuevo.';
        }
        
        setTimeout(() => this.errorMessage = '', 6000);
      }
    });
  }
}