import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemCuenta } from '../modelo/item-cuenta';

import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private apiUrl = `${environment.apiUrl}/api/cuentas`;

  constructor(private http: HttpClient) {}

  // Buscar reserva activa por número de habitación
  getReservaPorHabitacion(numeroHabitacion: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reserva-por-habitacion/${numeroHabitacion}`);
  }

  // Obtener todos los items de una cuenta
  getItemsCuenta(cuentaId: number): Observable<ItemCuenta[]> {
    return this.http.get<ItemCuenta[]>(`${this.apiUrl}/${cuentaId}/items`);
  }

  // Agregar servicio a la cuenta
  agregarServicio(cuentaId: number, servicioId: number, cantidad: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/${cuentaId}/agregar-servicio`, { servicioId, cantidad });
  }

  // Eliminar un item de la cuenta
  eliminarItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${itemId}`);
  }

  // Pagar todos los servicios de la cuenta
  pagarCuenta(cuentaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${cuentaId}/pagar`, {});
  }
}