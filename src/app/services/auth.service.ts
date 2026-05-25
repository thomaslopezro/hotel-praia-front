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

  constructor(private http: HttpClient, private router: Router) {
    // Rehidratar la sesion desde localStorage al iniciar la app.
    // Necesario cuando el usuario vuelve de un dominio externo (Stripe, etc)
    // o refresca la pagina: sin esto el userSubject queda en null aunque
    // el token siga guardado.
    const raw = localStorage.getItem('user_data');
    if (raw) {
      try {
        this.userSubject.next(JSON.parse(raw));
      } catch {
        localStorage.removeItem('user_data');
      }
    }
  }

  // Cambiado para aceptar (correo, contrasena) y mapear internamente al DTO
  login(username: string, password: string): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        // Sincronizamos email con correo para los componentes que lo requieran
        response.correo = response.email;

        // Persistencia del token, el rol y el user completo (para rehidratar tras redirect externo)
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_role', response.rol);
        localStorage.setItem('user_data', JSON.stringify(response));
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
  // Apunta a /api/huespedes/{id} porque ahi vive el endpoint en el back.
  obtenerPorId(id: number | null): Observable<UserResponseDTO> {
    return this.http.get<any>(`http://localhost:8080/api/huespedes/${id}`).pipe(
      tap(huesped => {
        // El back devuelve la entidad Huesped con el correo dentro de user.username.
        // Aplanamos a correo/email para que los componentes los puedan usar directo.
        const correo = huesped.correo
          || huesped.email
          || huesped.user?.username
          || '';
        huesped.correo = correo;
        huesped.email = correo;
      }),
      catchError(this.handleError)
    );
  }

  // Actualizar datos del usuario (requerido por mi-perfil.component)
  actualizar(id: number | null, userData: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/huespedes/${id}`, userData).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar usuario (requerido por mi-perfil.component)
  eliminar(id: number | null): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/huespedes/${id}`).pipe(
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

  // Verifica si el usuario es OPERADOR (estrictamente, no admin).
  // El rol se guarda SIN prefijo "ROLE_" tras el login.
  esOperador(): boolean {
    return localStorage.getItem('user_role') === 'OPERADOR';
  }

  // Verifica si el usuario es ADMIN
  esAdmin(): boolean {
    return localStorage.getItem('user_role') === 'ADMIN';
  }

  // Verifica si el usuario es CLIENTE
  esCliente(): boolean {
    return localStorage.getItem('user_role') === 'CLIENTE';
  }

  // Retorna el ID del usuario para el componente mi-perfil
  getUsuarioId(): number | null {
    const user = this.userSubject.value;
    return user ? user.id : null;
  }

  private handleError(error: HttpErrorResponse) {
    let msg = 'Error en el sistema';
    if (error.error && error.error.err) {
      // Ahora capturamos el mensaje real del backend para cualquier estado (400, 401, etc)
      msg = error.error.err;
    } else if (error.status === 401) {
      msg = 'Sesión no válida o credenciales incorrectas';
    } else if (error.status === 403) {
      msg = 'Acceso denegado';
    }
    
    console.error(`Error HTTP ${error.status}:`, error);
    return throwError(() => new Error(msg));
  }
}