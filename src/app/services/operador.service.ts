import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Operador } from '../modelo/operador';

import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OperadorService {
  private adminUrl = `${environment.apiUrl}/api/operadores/admin`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Operador[]> {
    return this.http.get<any[]>(this.adminUrl).pipe(
      map(items => items.map(item => this.mapear(item)))
    );
  }

  getById(id: number): Observable<Operador> {
    return this.http.get<any>(`${this.adminUrl}/${id}`).pipe(
      map(item => this.mapear(item))
    );
  }

  create(data: Operador): Observable<Operador> {
    // El back espera la entidad Operador con un UserEntity anidado:
    // { user: { username: ..., password: ... } }
    const payload = {
      user: {
        username: data.correo,
        password: data.contrasena
      }
    };
    return this.http.post<Operador>(this.adminUrl, payload);
  }

  update(id: number, data: Operador): Observable<Operador> {
    const user: any = { username: data.correo };
    // Solo enviar password si el admin lo cambio (en edicion es opcional)
    if (data.contrasena && data.contrasena.trim() !== '') {
      user.password = data.contrasena;
    }
    return this.http.put<Operador>(`${this.adminUrl}/${id}`, { user });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }

  private mapear(item: any): Operador {
    // El back devuelve la entidad Operador con user.username (que es el correo)
    return {
      id:     item.id,
      correo: item.user?.username ?? item.correo ?? ''
    };
  }
}