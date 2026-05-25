import { Component, OnInit } from '@angular/core';
import { Testimonial } from '../../../../modelo/Testimonial';
import { TestimonioService, TestimonioBack } from '../../../../services/testimonio.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {
  testimonials: Testimonial[] = [];
  cargando = true;

  // Formulario inline para crear testimonio
  mostrarForm = false;
  nuevoTexto = '';
  nuevasEstrellas = 5;
  guardando = false;
  errorForm = '';
  mensajeOk = '';

  constructor(
    private testimonioService: TestimonioService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.testimonioService.getAll().subscribe({
      next: (data) => {
        this.testimonials = data.map(t => this.mapear(t));
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  // Convierte la respuesta del back al modelo que ya usa el HTML
  private mapear(t: TestimonioBack): Testimonial {
    return {
      id: t.id ?? 0,
      quote: t.texto,
      author: t.autor,
      timeAgo: this.tiempoRelativo(t.fechaCreacion),
      stars: '★'.repeat(t.estrellas)
    };
  }

  private tiempoRelativo(fecha?: string): string {
    if (!fecha) return '';
    const ahora = Date.now();
    const f = new Date(fecha).getTime();
    const diffMs = ahora - f;
    const dia = 1000 * 60 * 60 * 24;
    const dias = Math.floor(diffMs / dia);
    if (dias < 1) return 'Hoy';
    if (dias === 1) return 'Hace 1 día';
    if (dias < 7) return `Hace ${dias} días`;
    const semanas = Math.floor(dias / 7);
    if (semanas === 1) return 'Hace 1 semana';
    if (semanas < 5) return `Hace ${semanas} semanas`;
    const meses = Math.floor(dias / 30);
    if (meses === 1) return 'Hace 1 mes';
    return `Hace ${meses} meses`;
  }

  abrirForm(): void {
    this.mostrarForm = true;
    this.errorForm = '';
    this.mensajeOk = '';
  }

  cancelar(): void {
    this.mostrarForm = false;
    this.nuevoTexto = '';
    this.nuevasEstrellas = 5;
    this.errorForm = '';
  }

  enviar(): void {
    this.errorForm = '';
    if (!this.nuevoTexto || this.nuevoTexto.trim().length < 5) {
      this.errorForm = 'Escribe un comentario (mínimo 5 caracteres).';
      return;
    }
    if (this.nuevasEstrellas < 1 || this.nuevasEstrellas > 5) {
      this.errorForm = 'Selecciona entre 1 y 5 estrellas.';
      return;
    }

    const user = this.authService.getCurrentUser();
    const autor = user
      ? `${(user as any).nombre ?? ''} ${(user as any).apellido ?? ''}`.trim() || (user as any).correo || (user as any).email || 'Anónimo'
      : 'Anónimo';

    this.guardando = true;
    this.testimonioService.crear({
      autor,
      texto: this.nuevoTexto.trim(),
      estrellas: this.nuevasEstrellas
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.mensajeOk = '¡Gracias por tu comentario!';
        this.mostrarForm = false;
        this.nuevoTexto = '';
        this.nuevasEstrellas = 5;
        this.cargar();
        setTimeout(() => this.mensajeOk = '', 3000);
      },
      error: (err) => {
        this.guardando = false;
        this.errorForm = err?.error?.err || 'No se pudo enviar el comentario.';
      }
    });
  }

  setEstrellas(n: number): void {
    this.nuevasEstrellas = n;
  }
}
