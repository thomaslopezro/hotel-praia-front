import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Servicio } from '../modelo/servicio';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private apiUrl = 'http://localhost:8080/api/servicios';

  constructor(private http: HttpClient) {}

  // Mapea la respuesta del back (campos en castellano) al modelo del front
  // (campos en ingles). Las features ahora vienen como array normalizado del
  // back; antes el front las leia de horario, lo que sobreescribia el horario.
  private toFront(bs: any): Servicio {
    return {
      id: bs.id,
      title: bs.nombre,
      subtitle: bs.descripcion,
      description: bs.descripcion,
      image: bs.imagenUrl,
      precio: bs.precio,
      precioTipo: bs.precioTipo,
      horario: bs.horario,
      capacidad: bs.capacidad,
      features: Array.isArray(bs.features) ? bs.features : []
    };
  }

  private toBack(servicio: Servicio): any {
    return {
      nombre: servicio.title,
      descripcion: servicio.subtitle,
      precio: servicio.precio ?? 0,
      imagenUrl: servicio.image,
      capacidad: 1,
      precioTipo: servicio.precioTipo ?? 'Por persona',
      horario: servicio.horario ?? '',
      features: servicio.features ?? []
    };
  }

  getAll(): Observable<Servicio[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(backendServicios => backendServicios.map(bs => this.toFront(bs)))
    );
  }

  getById(id: number): Observable<Servicio> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(bs => this.toFront(bs))
    );
  }

  create(servicio: Servicio): Observable<Servicio> {
    return this.http.post<any>(this.apiUrl, this.toBack(servicio)).pipe(
      map(bs => this.toFront(bs))
    );
  }

  update(id: number, servicio: Servicio): Observable<Servicio> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, this.toBack(servicio)).pipe(
      map(bs => this.toFront(bs))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Verificar si un servicio está asociado a una reserva
  verificarAsociacion(id: number): Observable<{ asociado: boolean; reservas?: number }> {
    return this.http.get<any>(`${this.apiUrl}/${id}/verificar-asociacion`).pipe(
      map(response => ({
        asociado: response.asociado || response.reservasCount > 0,
        reservas: response.reservasCount
      }))
    );
  }
}
