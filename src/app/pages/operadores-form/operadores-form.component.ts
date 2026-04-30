import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Operador } from '../../modelo/operador';
import { OperadorService } from '../../services/operador.service';

@Component({
  selector: 'app-operadores-form',
  templateUrl: './operadores-form.component.html',
  styleUrls: ['./operadores-form.component.scss']
})
export class OperadoresFormComponent implements OnInit {
  form!: FormGroup;
  editing = false;
  operadorId!: number;
  guardando = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private operadorService: OperadorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editing = true;
      this.operadorId = Number(id);

      this.operadorService.getById(this.operadorId).subscribe({
        next: (operador) => {
          this.form.patchValue({
            correo: operador.correo
          });
          this.form.get('contrasena')?.clearValidators();
          this.form.get('contrasena')?.updateValueAndValidity();
        },
        error: (err) => console.error('Error cargando operador:', err)
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
    const operador: Operador = {
      id: this.editing ? this.operadorId : undefined,
      correo: value.correo,
      contrasena: value.contrasena || undefined
    };

    this.guardando = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.editing) {
      this.operadorService.update(this.operadorId, operador).subscribe({
        next: () => {
          this.successMessage = 'Operador actualizado correctamente';
          setTimeout(() => this.router.navigate(['/operador/admin']), 1500);
        },
        error: (err) => {
          this.errorMessage = `Error: ${err.error?.message || err.message || 'Error al actualizar'}`;
          this.guardando = false;
        },
        complete: () => (this.guardando = false)
      });
    } else {
      this.operadorService.create(operador).subscribe({
        next: () => {
          this.successMessage = 'Operador creado correctamente';
          this.form.reset();
          setTimeout(() => this.router.navigate(['/operador/admin']), 1500);
        },
        error: (err) => {
          this.errorMessage = `Error: ${err.error?.message || err.message || 'Error al crear'}`;
          this.guardando = false;
        },
        complete: () => (this.guardando = false)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/operador/admin']);
  }
}
