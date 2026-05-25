import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CheckoutResponse {
  url: string;
  sessionId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private apiUrl = 'http://localhost:8080/api/pagos';

  constructor(private http: HttpClient) {}

  iniciarPagoReserva(data: {
    tipoHabitacionId: number;
    huespedId: number;
    cantidadPersonas: number;
    fechaInicio: string;
    fechaFin: string;
  }): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/reserva/checkout`, data);
  }

  confirmarPagoReserva(sessionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reserva/confirmar`, { sessionId });
  }

  iniciarPagoServicios(cuentaId: number): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/servicios/checkout`, { cuentaId });
  }

  confirmarPagoServicios(sessionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/servicios/confirmar`, { sessionId });
  }
}
