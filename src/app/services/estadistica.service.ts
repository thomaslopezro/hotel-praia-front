import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProximaLlegada {
  id: number;
  nombre: string;
  apellido: string;
  habitacion: string;
  fechaInicio: string;
  personas: number;
}

export interface EstadisticasDashboard {
  totalHabitaciones: number;
  habitacionesOcupadas: number;
  reservasActivas: number;
  totalHuespedes: number;
  serviciosActivos: number;
  totalServicios: number;
  ingresosMes: number;
  proximasLlegadas: ProximaLlegada[];
  porcentajeOcupacion: number;
  calificacion?: number;
  totalTestimonios?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstadisticaService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getEstadisticasDashboard(): Observable<EstadisticasDashboard> {
    return this.http.get<EstadisticasDashboard>(`${this.apiUrl}/estadisticas/dashboard`);
  }
}