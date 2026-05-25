import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // Fechas para el filtro del reporte Excel. Default: primer dia del mes -> hoy.
  reporteDesde: string = this.primerDiaDelMes();
  reporteHasta: string = this.hoyISO();
  descargandoReporte: boolean = false;
  errorReporte: string = '';

  constructor(
    private authService: AuthService,
    private estadisticaService: EstadisticaService,
    private http: HttpClient,
    private router: Router
  ) {}

  private primerDiaDelMes(): string {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().substring(0, 10);
  }

  private hoyISO(): string {
    return new Date().toISOString().substring(0, 10);
  }

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

  descargarReporte(): void {
    this.errorReporte = '';
    if (!this.reporteDesde || !this.reporteHasta) {
      this.errorReporte = 'Selecciona ambas fechas.';
      return;
    }
    if (this.reporteDesde > this.reporteHasta) {
      this.errorReporte = 'La fecha "desde" no puede ser mayor que "hasta".';
      return;
    }
    this.descargandoReporte = true;
    const url = `http://localhost:8080/api/reportes/pagos.xlsx?desde=${this.reporteDesde}&hasta=${this.reporteHasta}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const downloadUrl = window.URL.createObjectURL(blob);
        a.href = downloadUrl;
        a.download = `reporte-pagos-${this.reporteDesde}_${this.reporteHasta}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
        this.descargandoReporte = false;
      },
      error: (err) => {
        console.error('Error descargando reporte:', err);
        this.errorReporte = 'No se pudo generar el reporte.';
        this.descargandoReporte = false;
      }
    });
  }
}