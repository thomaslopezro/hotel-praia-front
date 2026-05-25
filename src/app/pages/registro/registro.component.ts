import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {

  registroForm: FormGroup;

  mensaje = '';
  error = '';
  mostrarPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.registroForm = this.fb.group({

      nombre: ['', Validators.required],

      apellido: ['', Validators.required],

      correo: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      contrasena: ['', Validators.required],

      cedula: ['', Validators.required],

      telefono: [''],

      direccion: [''],

      nacionalidad: ['']
    });
  }

  registrarse(): void {

    // =========================
    // VALIDAR FORMULARIO
    // =========================
    if (this.registroForm.invalid) {

      this.registroForm.markAllAsTouched();
      return;
    }

    const formValue = this.registroForm.value;

    // =========================
    // OBJETO CORRECTO
    // PARA EL BACKEND NUEVO
    // =========================
    const huesped = {

      nombre: formValue.nombre,

      apellido: formValue.apellido,

      cedula: formValue.cedula,

      telefono: formValue.telefono,

      direccion: formValue.direccion,

      nacionalidad: formValue.nacionalidad,

      user: {

        username: formValue.correo,

        password: formValue.contrasena
      }
    };

    console.log('Enviando huésped:', huesped);

    // =========================
    // REGISTRAR
    // =========================
    this.authService.registrar(huesped as any).subscribe({

      next: (resp: any) => {

        this.error = '';

        // El back devuelve un mensaje con "Revisa tu correo..." si verificacion esta activa
        this.mensaje = resp?.ok ||
          'Registro exitoso. Revisa tu correo para verificar tu cuenta antes de iniciar sesión.';

        console.log('Registro exitoso');

        // Dejamos 4s para que lea el mensaje antes de mandarlo al login
        setTimeout(() => {

          this.router.navigate(['/login']);

        }, 4000);
      },

      error: (err) => {

        console.error('Error completo:', err);

        this.error =
          err?.error?.err ||
          err?.error?.message ||
          'No fue posible registrar el usuario';
      }
    });
  }
}