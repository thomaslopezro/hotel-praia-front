import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { ChatbotService, ChatMessage } from '../../services/chatbot.service';

@Component({
  selector: 'app-chatbot-widget',
  templateUrl: './chatbot-widget.component.html',
  styleUrls: ['./chatbot-widget.component.scss']
})
export class ChatbotWidgetComponent implements AfterViewChecked {
  abierto = false;
  enviando = false;
  borrador = '';

  messages: ChatMessage[] = [
    {
      role: 'assistant',
      content: 'Hola! Soy el asistente virtual de Hotel Praia. ¿En qué te puedo ayudar? Puedo contarte sobre nuestras habitaciones, servicios, precios y disponibilidad.'
    }
  ];

  @ViewChild('scrollAnchor') private scrollAnchor!: ElementRef<HTMLDivElement>;

  constructor(private chatbotService: ChatbotService) {}

  toggle(): void {
    this.abierto = !this.abierto;
  }

  enviar(): void {
    const texto = this.borrador.trim();
    if (!texto || this.enviando) return;

    this.messages.push({ role: 'user', content: texto });
    this.borrador = '';
    this.enviando = true;

    this.chatbotService.enviar(this.messages).subscribe({
      next: (resp) => {
        this.messages.push({ role: 'assistant', content: resp.reply });
        this.enviando = false;
      },
      error: () => {
        this.messages.push({
          role: 'assistant',
          content: 'Disculpa, no pude responder ahora. Intenta de nuevo en un momento.'
        });
        this.enviando = false;
      }
    });
  }

  onKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      this.enviar();
    }
  }

  ngAfterViewChecked(): void {
    if (this.abierto && this.scrollAnchor) {
      this.scrollAnchor.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }
}
