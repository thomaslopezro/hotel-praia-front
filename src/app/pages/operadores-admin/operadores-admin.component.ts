import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Operador } from '../../modelo/operador';
import { OperadorService } from '../../services/operador.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-operadores-admin',
  templateUrl: './operadores-admin.component.html',
  styleUrls: ['./operadores-admin.component.scss']
})
export class OperadoresAdminComponent implements OnInit {

  operadores: Operador[] = [];
  cargando = true;
  error = '';
  okMessage = '';
  errMessage = '';

  constructor(
    private operadorService: OperadorService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarOperadores();
  }

  esOperador(): boolean {
    return this.authService.esOperador();
  }

  cargarOperadores(): void {
    this.cargando = true;
    this.operadorService.getAll().subscribe({
      next: (data) => {
        this.operadores = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando operadores:', err);
        this.error = 'Error al cargar los operadores';
        this.cargando = false;
      }
    });
  }

  goToCreate(): void {
    this.router.navigate(['/operadores/admin/nuevo']);
  }

  goToEdit(id?: number): void {
    if (id) this.router.navigate(['/operadores/admin/editar', id]);
  }

  eliminarOperador(id?: number): void {
    if (!id) return;
    if (!confirm('¿Eliminar este operador?')) return;

    this.operadorService.delete(id).subscribe({
      next: () => {
        this.okMessage = 'Operador eliminado correctamente.';
        this.errMessage = '';
        this.cargarOperadores();
        setTimeout(() => this.okMessage = '', 3000);
      },
      error: (err) => {
        const status = err.status || 0;
        if (status === 409 || status === 400) {
          this.errMessage = 'No se puede eliminar este operador porque tiene datos asociados.';
        } else if (status === 404) {
          this.errMessage = 'El operador no fue encontrado. Recarga la página.';
        } else {
          this.errMessage = err.error?.message || 'Error al eliminar el operador.';
        }
        this.okMessage = '';
        setTimeout(() => this.errMessage = '', 5000);
      }
    });
  }
}
