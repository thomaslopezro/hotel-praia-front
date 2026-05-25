import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private apiUrl = 'http://localhost:8080/api/chatbot/mensaje';

  constructor(private http: HttpClient) {}

  // El back espera role 'user' o 'model'. Lo traducimos aqui para que el
  // componente trabaje con la convencion 'user' / 'assistant'.
  enviar(messages: ChatMessage[]): Observable<{ reply: string }> {
    const payload = {
      messages: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content
      }))
    };
    return this.http.post<{ reply: string }>(this.apiUrl, payload);
  }
}
