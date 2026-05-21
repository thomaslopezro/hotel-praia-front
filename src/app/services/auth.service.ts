import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthRequestDTO, UserResponseDTO } from '../interfaces/dtos';
import { Router } from '@angular/router';

// Exportamos este alias para no romper la importación en login.component.ts
export type AuthResponse = UserResponseDTO;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private userSubject = new BehaviorSubject<UserResponseDTO | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  // Cambiado para aceptar (correo, contrasena) y mapear internamente al DTO
  login(username: string, password: string): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        // Sincronizamos email con correo para los componentes que lo requieran
        response.correo = response.email;
        
        // Persistencia del token y el rol
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_role', response.rol);
        this.userSubject.next(response);
      }),
      catchError(this.handleError)
    );
  }

  // Recupera el perfil del usuario logueado basándose en el token enviado
  getUserDetails(): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/details`).pipe(
      tap(user => {
        user.correo = user.email;
        this.userSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  // Registrar un nuevo huésped (requerido por registro.component)
  registrar(huesped: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registro`, huesped).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un usuario específico por ID (requerido por mi-perfil.component)
  obtenerPorId(id: number | null): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/usuario/${id}`).pipe(
      tap(user => {
        user.correo = user.email;
      }),
      catchError(this.handleError)
    );
  }

  // Actualizar datos del usuario (requerido por mi-perfil.component)
  actualizar(id: number | null, userData: any): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.apiUrl}/usuario/${id}`, userData).pipe(
      tap(user => {
        user.correo = user.email;
        // Sincronizar el subject si el usuario editado es el que tiene la sesión iniciada
        const current = this.userSubject.value;
        if (current && current.id === user.id) {
          this.userSubject.next(user);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Eliminar usuario (requerido por mi-perfil.component)
  eliminar(id: number | null): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuario/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.clear();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verifica si existe un token almacenado para determinar el estado de la sesión
  estaLogueado(): boolean {
    return !!this.getToken();
  }

  // Retorna el usuario actual almacenado en el BehaviorSubject
  // Nota: Si se refresca la página, este valor será null hasta que se llame a getUserDetails()
  getCurrentUser(): UserResponseDTO | null {
    return this.userSubject.value;
  }

  // Verifica si el usuario tiene rol de administrador u operador
  esOperador(): boolean {
    const role = localStorage.getItem('user_role');
    return role === 'ROLE_OPERADOR' || role === 'ROLE_ADMIN';
  }

  // Retorna el ID del usuario para el componente mi-perfil
  getUsuarioId(): number | null {
    const user = this.userSubject.value;
    return user ? user.id : null;
  }

  private handleError(error: HttpErrorResponse) {
    let msg = 'Error en el sistema';
    if (error.status === 401) msg = 'Sesión no válida o credenciales incorrectas';
    if (error.status === 403) msg = 'Acceso denegado';
    
    console.error(`Error HTTP ${error.status}: ${error.message}`);
    return throwError(() => new Error(msg));
  }
}