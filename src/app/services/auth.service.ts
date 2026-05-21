import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthRequestDTO, UserResponseDTO } from '../interfaces/dtos';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private userSubject = new BehaviorSubject<UserResponseDTO | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: AuthRequestDTO): Observable<string> {
    return this.http.post<UserResponseDTO>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Persistencia del token y el rol
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_role', response.rol);
        this.userSubject.next(response);
      }),
      map(response => response.token), // El componente solo ve el token
      catchError(this.handleError)
    );
  }

  // Recupera el perfil del usuario logueado basándose en el token enviado
  getUserDetails(): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.apiUrl}/details`).pipe(
      tap(user => this.userSubject.next(user)),
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

  private handleError(error: HttpErrorResponse) {
    let msg = 'Error en el sistema';
    if (error.status === 401) msg = 'Sesión no válida o credenciales incorrectas';
    if (error.status === 403) msg = 'Acceso denegado';
    
    console.error(`Error HTTP ${error.status}: ${error.message}`);
    return throwError(() => new Error(msg));
  }
}