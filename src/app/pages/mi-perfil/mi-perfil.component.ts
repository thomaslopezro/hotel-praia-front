import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Huesped } from 'src/app/modelo/huesped';
import { Reserva } from 'src/app/modelo/reserva';

import { AuthService } from 'src/app/services/auth.service';
import { ReservaService } from 'src/app/services/reserva.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent implements OnInit {

  perfilForm: FormGroup;

  usuarioId: number | null = null;

  reservas: Reserva[] = [];

  mensaje = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private reservaService: ReservaService,
    private router: Router
  ) {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      cedula: ['', Validators.required],
      telefono: [''],
      direccion: [''],
      nacionalidad: ['']
    });
  }

  ngOnInit(): void {

    this.usuarioId = this.authService.getUsuarioId();

    if (!this.usuarioId) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    this.cargarPerfil();
    this.cargarReservas();
  }

  private manejarErrorSeguridad(err: any): boolean {

    if (err?.status === 401) {
      this.error = 'Tu sesión expiró o no estás autenticado. Inicia sesión nuevamente.';
      this.authService.logout();
      this.router.navigate(['/login']);
      return true;
    }

    if (err?.status === 403) {
      this.error = 'No tienes permiso para acceder a esta información.';
      this.authService.logout();
      this.router.navigate(['/login']);
      return true;
    }

    return false;
  }

  cargarPerfil(): void {

    if (!this.usuarioId) {
      return;
    }

    this.authService.obtenerPorId(this.usuarioId).subscribe({

      next: (usuario: Huesped) => {

        this.error = '';

        this.perfilForm.patchValue({
          nombre: usuario.nombre || '',
          apellido: usuario.apellido || '',
          correo: usuario.correo || '',
          cedula: usuario.cedula || '',
          telefono: usuario.telefono || '',
          direccion: usuario.direccion || '',
          nacionalidad: usuario.nacionalidad || ''
        });
      },

      error: (err) => {

        console.error('ERROR CARGANDO PERFIL:', err);

        if (this.manejarErrorSeguridad(err)) {
          return;
        }

        this.error = 'No fue posible cargar la información del perfil.';
      }
    });
  }

  cargarReservas(): void {

    if (!this.usuarioId) {
      return;
    }

    this.reservaService.listarPorHuesped(this.usuarioId).subscribe({

      next: (data: Reserva[]) => {

        this.reservas = data;
      },

      error: (err) => {

        console.error('ERROR CARGANDO RESERVAS:', err);

        if (this.manejarErrorSeguridad(err)) {
          return;
        }

        this.error = 'No fue posible cargar las reservas.';
      }
    });
  }

  guardarCambios(): void {

    if (this.perfilForm.invalid || !this.usuarioId) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    const datosActualizados = {
      nombre: this.perfilForm.value.nombre,
      apellido: this.perfilForm.value.apellido,
      correo: this.perfilForm.value.correo,
      cedula: this.perfilForm.value.cedula,
      telefono: this.perfilForm.value.telefono,
      direccion: this.perfilForm.value.direccion,
      nacionalidad: this.perfilForm.value.nacionalidad
    };

    this.authService.actualizar(this.usuarioId, datosActualizados as any).subscribe({

      next: () => {

        this.mensaje = 'Perfil actualizado correctamente.';
        this.error = '';

        const currentUser = this.authService.getCurrentUser();

        if (currentUser) {
          const usuarioActualizado = {
            ...currentUser,
            nombre: this.perfilForm.value.nombre,
            apellido: this.perfilForm.value.apellido,
            correo: this.perfilForm.value.correo
          };

          localStorage.setItem('currentUser', JSON.stringify(usuarioActualizado));
        }

        localStorage.setItem('nombre', this.perfilForm.value.nombre);
        localStorage.setItem('correo', this.perfilForm.value.correo);
      },

      error: (err) => {

        console.error('ERROR ACTUALIZANDO PERFIL:', err);

        if (this.manejarErrorSeguridad(err)) {
          return;
        }

        this.error = 'No fue posible actualizar el perfil.';
        this.mensaje = '';
      }
    });
  }

  cancelarReserva(id?: number): void {

    if (!id) {
      return;
    }

    this.reservaService.cancelarReserva(id).subscribe({

      next: () => {

        this.reservas = this.reservas.filter(r => r.id !== id);
        this.mensaje = 'Reserva cancelada correctamente.';
        this.error = '';
      },

      error: (err) => {

        console.error('ERROR CANCELANDO RESERVA:', err);

        if (this.manejarErrorSeguridad(err)) {
          return;
        }

        this.error = 'No fue posible cancelar la reserva.';
      }
    });
  }

  eliminarCuenta(): void {

    if (!this.usuarioId) {
      return;
    }

    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );

    if (!confirmar) {
      return;
    }

    this.authService.eliminar(this.usuarioId).subscribe({

      next: () => {

        this.authService.logout();
        this.router.navigate(['/']);
      },

      error: (err) => {

        console.error('ERROR ELIMINANDO CUENTA:', err);

        if (this.manejarErrorSeguridad(err)) {
          return;
        }

        this.error = 'No fue posible eliminar la cuenta.';
      }
    });
  }
}