import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EstadisticaService, EstadisticasDashboard, ProximaLlegada } from 'src/app/services/estadistica.service';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.scss']
})
export class MenuAdminComponent implements OnInit {
  operadorNombre: string = '';
  fechaActual: Date = new Date();
  loading: boolean = true;
  error: string = '';
  
  estadisticas: EstadisticasDashboard = {
    totalHabitaciones: 0,
    habitacionesOcupadas: 0,
    porcentajeOcupacion: 0,
    reservasActivas: 0,
    totalHuespedes: 0,
    serviciosActivos: 0,
    totalServicios: 0,
    ingresosMes: 0,
    proximasLlegadas: [],
    calificacion: 0,
    totalTestimonios: 0
  };

  constructor(
    private authService: AuthService,
    private estadisticaService: EstadisticaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.rol === 'OPERADOR') {
      this.operadorNombre = currentUser.correo.split('@')[0];
    }
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.loading = true;
    this.estadisticaService.getEstadisticasDashboard().subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.loading = false;
        console.log('Estadísticas cargadas:', data);
      },
      error: (err) => {
        console.error('Error cargando estadísticas:', err);
        this.error = 'No se pudieron cargar las estadísticas';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  formatearIngresos(): string {
    return this.estadisticas.ingresosMes.toLocaleString('es-CO');
  }

  // Mes y año actuales en formato legible "Mayo 2026"
  mesActualLabel(): string {
    const f = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' });
    const txt = f.format(this.fechaActual);
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  }

  // Devuelve la calificacion del back o "Sin reseñas" si no hay testimonios
  calificacionLabel(): string {
    if (!this.estadisticas.totalTestimonios) return 'Sin reseñas';
    return (this.estadisticas.calificacion ?? 0).toFixed(1);
  }
}