import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Servicio } from '../../modelo/servicio';
import { ServiciosService } from '../../services/servicios.service';

@Component({
  selector: 'app-servicio-form',
  templateUrl: './servicios-form.component.html',
})
export class ServicioFormComponent implements OnInit {
  editing = false;
  servicioId: number | null = null;

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    subtitle: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
    features: new FormControl('', Validators.required),
    precio: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviciosService: ServiciosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editing = true;
      this.servicioId = +id;

      this.serviciosService.getById(+id).subscribe({
        next: (servicio: Servicio) => {
          this.form.setValue({
            title: servicio.title,
            subtitle: servicio.subtitle,
            description: servicio.description,
            image: servicio.image,
            features: servicio.features.join(', '), // Convertir array a string
            precio: servicio.precio ?? 0,
          });
        },
        error: (err) => console.error('Error cargando servicio:', err)
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;

    const valor = this.form.value;

    const servicio: Servicio = {
      id: this.servicioId ?? 0,
      title: valor.title ?? '',
      subtitle: valor.subtitle ?? '',
      description: valor.description ?? '',
      image: valor.image ?? '',
      features: (valor.features ?? '')
        .split(',')
        .map(f => f.trim())
        .filter(f => f.length > 0),
      precio: valor.precio ?? 0,
    };

    if (this.editing && this.servicioId !== null) {
      this.serviciosService.update(this.servicioId, servicio).subscribe({
        next: () => this.router.navigate(['/servicios/admin']),
        error: (err) => console.error('Error actualizando:', err)
      });
    } else {
      this.serviciosService.create(servicio).subscribe({
        next: () => this.router.navigate(['/servicios/admin']),
        error: (err) => console.error('Error creando:', err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/servicios/admin']);
  }
}