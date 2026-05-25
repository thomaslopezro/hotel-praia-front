import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TestimonioBack {
  id?: number;
  autor: string;
  texto: string;
  estrellas: number;
  fechaCreacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TestimonioService {
  private apiUrl = 'http://localhost:8080/api/testimonios';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TestimonioBack[]> {
    return this.http.get<TestimonioBack[]>(this.apiUrl);
  }

  crear(data: { autor: string; texto: string; estrellas: number }): Observable<TestimonioBack> {
    return this.http.post<TestimonioBack>(this.apiUrl, data);
  }
}
