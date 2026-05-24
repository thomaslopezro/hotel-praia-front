import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoHabitacion } from '../../modelo/tipo-habitacion';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';

@Component({
  selector: 'app-tipo-habitacion-form',
  templateUrl: './tipo-habitacion-form.component.html',
  styleUrls: ['./tipo-habitacion-form.component.scss']
})
export class TipoHabitacionFormComponent implements OnInit {
  form!: FormGroup;
  editing = false;
  roomId!: number;
  guardando = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private tipoHabitacionService: TipoHabitacionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:        ['', Validators.required],
      description: ['', Validators.required],
      price:       [0, [Validators.required, Validators.min(0)]],
      imageUrl:    [''],
      capacity:    [1, [Validators.required, Validators.min(1)]],
      beds:        ['', Validators.required],
      amenities:   ['', Validators.required],
      available:   [true]
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editing = true;
      this.roomId = Number(id);

      // 👇 getById ahora retorna Observable
      this.tipoHabitacionService.getById(this.roomId).subscribe({
        next: (room) => {
          this.form.patchValue({
            ...room,
            amenities: room.amenities.join(', ') // 👈 array → string para el input
          });
        },
        error: (err) => console.error('Error cargando tipo de habitación:', err)
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Completa todos los campos requeridos';
      return;
    }

    const value = this.form.value;

    const room: TipoHabitacion = {
      id:          this.editing ? this.roomId : 0,
      name:        value.name,
      description: value.description,
      price:       Number(value.price),
      imageUrl:    value.imageUrl,
      capacity:    Number(value.capacity),
      beds:        value.beds,
      available:   value.available || true,
      amenities:   value.amenities
                    .split(',')
                    .map((item: string) => item.trim())
                    .filter((item: string) => item.length > 0),
    };

    this.guardando = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Enviando:', room);

    if (this.editing) {
      this.tipoHabitacionService.update(this.roomId, room).subscribe({
        next: (response) => {
          console.log('Actualizado exitosamente:', response);
          this.successMessage = 'Tipo de habitación actualizado correctamente';
          setTimeout(() => this.router.navigate(['/tipos-habitacion']), 1500);
        },
        error: (err) => {
          console.error('Error actualizando:', err);
          this.errorMessage = `Error: ${err.error?.message || err.message || 'Error al actualizar'}`;
          this.guardando = false;
        }
      });
    } else {
      this.tipoHabitacionService.create(room).subscribe({
        next: (response) => {
          console.log('Creado exitosamente:', response);
          this.successMessage = 'Tipo de habitación creado correctamente';
          setTimeout(() => this.router.navigate(['/tipos-habitacion']), 1500);
        },
        error: (err) => {
          console.error('Error creando:', err);
          this.errorMessage = `Error: ${err.error?.message || err.message || 'Error al crear'}`;
          this.guardando = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/tipos-habitacion']);
  }
}