import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Habitacion, TipoHabitacion } from '../modelo/habitacion';
import { TipoHabitacionService } from './tipo-habitacion.service';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  private apiUrl = 'http://localhost:8080/api/habitaciones';

  constructor(
    private http: HttpClient,
    private tipoService: TipoHabitacionService
  ) {}

  getAll(tipoId?: number): Observable<Habitacion[]> {
    const url = tipoId ? `${this.apiUrl}?tipoId=${tipoId}` : this.apiUrl;
    
    // Primero obtener las habitaciones y los tipos
    return forkJoin({
      habitaciones: this.http.get<any[]>(url),
      tipos: this.tipoService.getAll()
    }).pipe(
      map(({ habitaciones, tipos }) => {
        // Crear un mapa de tipos por ID
        const tiposMap = new Map<number, TipoHabitacion>();
        tipos.forEach(t => tiposMap.set(t.id, t));
        
        // Asignar el tipo a cada habitación
        return habitaciones.map(item => ({
          id: item.id,
          codigo: item.codigo,
          piso: item.piso,
          estado: item.estado,
          notas: item.notas,
          // El back ahora devuelve HabitacionDetalleDTO con tipoHabitacionId plano.
          // Tambien soportamos el formato anterior por compatibilidad.
          tipoHabitacion: tiposMap.get(item.tipoHabitacionId ?? item.tipoHabitacion?.id ?? item.tipoHabitacion)
        }));
      })
    );
  }

  getById(id: number): Observable<Habitacion> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      switchMap(async (item) => {
        let tipo = item.tipoHabitacion;
        if (tipo && !tipo.name && tipo.id) {
          tipo = await this.tipoService.getById(tipo.id).toPromise();
        }
        return {
          id: item.id,
          codigo: item.codigo,
          piso: item.piso,
          estado: item.estado,
          notas: item.notas,
          tipoHabitacion: tipo ? {
            id: tipo.id,
            name: tipo.nombre || tipo.name,
            description: tipo.descripcion || tipo.description,
            price: tipo.precio || tipo.price,
            imageUrl: tipo.imagenUrl || tipo.imageUrl,
            capacity: tipo.capacidad || tipo.capacity,
            beds: tipo.camas || tipo.beds,
            amenities: tipo.amenities
          } : undefined
        };
      })
    );
  }

  create(habitacion: any): Observable<Habitacion> {
    const payload = {
      codigo: habitacion.codigo,
      piso: Number(habitacion.piso),
      estado: habitacion.estado,
      tipoHabitacionId: Number(habitacion.tipoHabitacionId),
      notas: habitacion.notas
    };
    return this.http.post<Habitacion>(this.apiUrl, payload);
  }

  update(id: number, habitacion: any): Observable<Habitacion> {
    const payload = {
      codigo: habitacion.codigo,
      piso: Number(habitacion.piso),
      estado: habitacion.estado,
      tipoHabitacionId: Number(habitacion.tipoHabitacionId),
      notas: habitacion.notas
    };
    return this.http.put<Habitacion>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}