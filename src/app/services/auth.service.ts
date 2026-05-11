import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, BehaviorSubject } from 'rxjs';
import { Huesped } from '../modelo/huesped';

export interface AuthResponse {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'CLIENTE' | 'OPERADOR' | 'ADMIN';
  tipo: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
  }

  registrar(huesped: Huesped): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registro`, huesped);
  }

  login(correo: string, contrasena: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { correo, contrasena }).pipe(
      tap(response => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        localStorage.setItem('rol', response.rol);
        
        // Mantener compatibilidad con código existente
        if (response.rol === 'CLIENTE') {
          localStorage.setItem('huespedId', response.id.toString());
          localStorage.setItem('nombre', response.nombre);
          localStorage.setItem('correo', response.correo);
        } else if (response.rol === 'OPERADOR') {
          // Para operador, guardar el correo como identificador
          localStorage.setItem('operadorId', response.id.toString());
          localStorage.setItem('operadorCorreo', response.correo);
        }
        
        this.currentUserSubject.next(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rol');
    localStorage.removeItem('huespedId');
    localStorage.removeItem('nombre');
    localStorage.removeItem('correo');
    localStorage.removeItem('operadorId');
    localStorage.removeItem('operadorCorreo');
    this.currentUserSubject.next(null);
  }

  //  Método que usa MiPerfilComponent y ReservarComponent
  getUsuarioId(): number | null {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.rol === 'CLIENTE') {
      return currentUser.id;
    }
    const id = localStorage.getItem('huespedId');
    return id ? Number(id) : null;
  }

  //  Método que usa MiPerfilComponent
  obtenerPorId(id: number): Observable<Huesped> {
    return this.http.get<any>(`${this.apiUrl}/huespedes/${id}`).pipe(
      map(resp => this.mapearUsuario(resp))
    );
  }

  //  Método que usa MiPerfilComponent
  actualizar(id: number, huesped: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/huespedes/${id}`, huesped);
  }

  //  Método que usa MiPerfilComponent
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/huespedes/${id}`);
  }

  //  Método que usa MiPerfilComponent
  listar(): Observable<Huesped[]> {
    return this.http.get<any[]>(`${this.apiUrl}/huespedes/admin`).pipe(
      map(lista => lista.map(item => this.mapearUsuario(item)))
    );
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  estaLogueado(): boolean {
    return !!this.getCurrentUser();
  }

  esOperador(): boolean {
    return this.getRol() === 'OPERADOR';
  }

  esAdmin(): boolean {
    return this.getRol() === 'ADMIN';
  }

  esCliente(): boolean {
    return this.getRol() === 'CLIENTE';
  }

  private mapearUsuario(data: any): Huesped {
    return new Huesped(
      data.id ?? data.huespedId,
      data.nombre,
      data.apellido,
      data.correo,
      data.contrasena,
      data.cedula,
      data.telefono,
      data.direccion,
      data.nacionalidad,
      data.historialReservas || []
    );
  }
}