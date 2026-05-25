import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Reserva } from '../modelo/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:8080/api/reservas';
  private adminUrl = 'http://localhost:8080/api/reservas/admin';

  constructor(private http: HttpClient) {}

  // =========================
  // ADMIN
  // =========================
  getAll(): Observable<Reserva[]> {
    return this.http.get<any[]>(this.adminUrl).pipe(
      map(items => items.map(item => this.mapear(item)))
    );
  }

  getById(id: number): Observable<Reserva> {
    return this.http.get<any>(`${this.adminUrl}/${id}`).pipe(
      map(item => this.mapear(item))
    );
  }

  create(data: any): Observable<Reserva> {
    return this.http.post<Reserva>(this.adminUrl, data);
  }

  update(id: number, data: any): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.adminUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }

  // =========================
  // USUARIO / HUÉSPED
  // =========================
  listarPorHuesped(huespedId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/huesped/${huespedId}`);
  }

  crearReserva(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, data);
  }

  crearReservaPorTipo(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear-por-tipo`, data);
  }

  cancelarReserva(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancelar`, {});
  }

  // Agregar este método
finalizarReserva(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/finalizar`, {});
}

  // Factura completa de la reserva (habitacion + servicios)
  getFactura(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/factura`);
  }

  private mapear(item: any): Reserva {
    return {
      id: item.id,
      fechaInicio: item.fechaInicio,
      fechaFin: item.fechaFin,
      cantidadPersonas: item.cantidadPersonas,
      estado: item.estado,
      huesped: item.huesped,
      habitacion: item.habitacion,
      operador: item.operador
    };
  }
}