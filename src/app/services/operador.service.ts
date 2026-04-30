import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Operador } from '../modelo/operador';

@Injectable({
  providedIn: 'root'
})
export class OperadorService {
  private adminUrl = 'http://localhost:8080/api/operadores/admin';

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
    return this.http.post<Operador>(this.adminUrl, data);
  }

  update(id: number, data: Operador): Observable<Operador> {
    return this.http.put<Operador>(`${this.adminUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }

  private mapear(item: any): Operador {
    return {
      id:        item.id,
      correo:    item.correo,
      contrasena: item.contrasena
    };
  }
}