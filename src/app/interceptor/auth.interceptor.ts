import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const currentUser = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    );

    const token = currentUser?.token;

    // Si no hay token, enviar normal
    if (!token) {
      return next.handle(req);
    }

    // Agregar JWT automáticamente
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(cloned);
  }
}