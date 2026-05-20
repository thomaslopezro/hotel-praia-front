import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './features/landing/pages/home/home.component';

import { TiposHabitacionAdminComponent } from './pages/tipos-habitacion-admin/tipos-habitacion-admin.component';
import { TipoHabitacionFormComponent } from './pages/tipo-habitacion-form/tipo-habitacion-form.component';

import { ServiciosAdminComponent } from './pages/servicios-admin/servicios-admin.component';
import { ServicioFormComponent } from './pages/servicios-form/servicios-form.component';

import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';

import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';

import { ServiciosPublicComponent } from './pages/servicios-public/servicios-public.component';

import { HabitacionesAdminComponent } from './pages/habitaciones-admin/habitaciones-admin.component';
import { HabitacionesFormComponent } from './pages/habitaciones-form/habitaciones-form.component';

import { ReservarComponent } from './pages/reservar/reservar.component';

import { ReservasAdminComponent } from './pages/reservas-admin/reservas-admin.component';
import { ReservasFormComponent } from './pages/reservas-form/reservas-form.component';

import { MenuAdminComponent } from './pages/menu-admin/menu-admin.component';

import { ServiciosCuentaComponent } from './pages/servicios-cuenta/servicios-cuenta.component';

import { OperadoresAdminComponent } from './pages/operadores-admin/operadores-admin.component';
import { OperadoresFormComponent } from './pages/operadores-form/operadores-form.component';

// =========================
// GUARD
// =========================
import { AuthGuard } from './guards/auth-guard';

const routes: Routes = [

  // =========================
  // PÚBLICAS
  // =========================

  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'registro',
    component: RegistroComponent
  },

  {
    path: 'servicios',
    component: ServiciosPublicComponent
  },

  // =========================
  // CLIENTE
  // =========================

  {
    path: 'mi-perfil',
    component: MiPerfilComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'reservar-tipo/:id',
    component: ReservarComponent,
    canActivate: [AuthGuard]
  },

  // =========================
  // OPERADOR
  // =========================

  {
    path: 'menu-admin',
    component: MenuAdminComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'operador/servicios-cuenta',
    component: ServiciosCuentaComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  // =========================
  // ADMIN / OPERADOR
  // =========================

  {
    path: 'tipos-habitacion',
    component: TiposHabitacionAdminComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'tipos-habitacion/nuevo',
    component: TipoHabitacionFormComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'tipos-habitacion/editar/:id',
    component: TipoHabitacionFormComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'habitaciones/admin',
    component: HabitacionesAdminComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'habitaciones/admin/nuevo',
    component: HabitacionesFormComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'habitaciones/admin/editar/:id',
    component: HabitacionesFormComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'servicios/admin',
    component: ServiciosAdminComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'servicios/admin/nuevo',
    component: ServicioFormComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'servicios/admin/editar/:id',
    component: ServicioFormComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'reservas/admin',
    component: ReservasAdminComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'reservas/admin/nuevo',
    component: ReservasFormComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'reservas/admin/editar/:id',
    component: ReservasFormComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'operadores/admin',
    component: OperadoresAdminComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'operadores/admin/nuevo',
    component: OperadoresFormComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  {
    path: 'operadores/admin/editar/:id',
    component: OperadoresFormComponent,
    canActivate: [AuthGuard],
    data: { expectedRol: 'OPERADOR' }
  },

  // =========================
  // RUTA NO ENCONTRADA
  // =========================

  {
    path: '**',
    redirectTo: ''
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }