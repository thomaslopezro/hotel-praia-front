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

  getAll(): Observable<Servicio[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(backendServicios => backendServicios.map(bs => ({
        id: bs.id,
        title: bs.nombre,
        subtitle: bs.descripcion,
        description: bs.descripcion,
        image: bs.imagenUrl,
        precio: bs.precio,
        precioTipo: bs.precioTipo,
        horario: bs.horario,
        capacidad: bs.capacidad,
        features: bs.horario ? [bs.horario] : [] // o convertir horario en array
      })))
    );
  }

  getById(id: number): Observable<Servicio> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(bs => ({
        id: bs.id,
        title: bs.nombre,
        subtitle: bs.descripcion,
        description: bs.descripcion,
        image: bs.imagenUrl,
        precio: bs.precio,
        precioTipo: bs.precioTipo,
        horario: bs.horario,
        capacidad: bs.capacidad,
        features: bs.horario ? [bs.horario] : []
      }))
    );
  }

  create(servicio: Servicio): Observable<Servicio> {
    const backendServicio = {
      nombre: servicio.title,
      descripcion: servicio.subtitle,
      precio: servicio.precio ?? 0,
      imagenUrl: servicio.image,
      capacidad: 1,
      precioTipo: 'Por persona',
      horario: servicio.features.join(', ')
    };
    return this.http.post<any>(this.apiUrl, backendServicio).pipe(
      map(bs => ({
        id: bs.id,
        title: bs.nombre,
        subtitle: bs.descripcion,
        description: bs.descripcion,
        image: bs.imagenUrl,
        precio: bs.precio,
        precioTipo: bs.precioTipo,
        horario: bs.horario,
        capacidad: bs.capacidad,
        features: bs.horario ? [bs.horario] : []
      }))
    );
  }

  update(id: number, servicio: Servicio): Observable<Servicio> {
    const backendServicio = {
      nombre: servicio.title,
      descripcion: servicio.subtitle,
      precio: servicio.precio ?? 0,
      imagenUrl: servicio.image,
      capacidad: 1,
      precioTipo: 'Por persona',
      horario: servicio.features.join(', ')
    };
    return this.http.put<any>(`${this.apiUrl}/${id}`, backendServicio).pipe(
      map(bs => ({
        id: bs.id,
        title: bs.nombre,
        subtitle: bs.descripcion,
        description: bs.descripcion,
        image: bs.imagenUrl,
        precio: bs.precio,
        precioTipo: bs.precioTipo,
        horario: bs.horario,
        capacidad: bs.capacidad,
        features: bs.horario ? [bs.horario] : []
      }))
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