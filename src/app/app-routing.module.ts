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
import { AuthService } from './services/auth.service';
import { ServiciosCuentaComponent } from './pages/servicios-cuenta/servicios-cuenta.component';
import { OperadoresAdminComponent } from './pages/operadores-admin/operadores-admin.component';
import { OperadoresFormComponent } from './pages/operadores-form/operadores-form.component';



const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'mi-perfil', component: MiPerfilComponent },
  
  { path: 'tipos-habitacion', component: TiposHabitacionAdminComponent },
  { path: 'tipos-habitacion/nuevo', component: TipoHabitacionFormComponent },
  { path: 'tipos-habitacion/editar/:id', component: TipoHabitacionFormComponent },
  
  { path: 'servicios', component: ServiciosPublicComponent },
  { path: 'operador/servicios-cuenta', component: ServiciosCuentaComponent },

  { path: 'habitaciones/admin', component: HabitacionesAdminComponent },
  { path: 'habitaciones/admin/nuevo', component: HabitacionesFormComponent },
  { path: 'habitaciones/admin/editar/:id', component: HabitacionesFormComponent },


  { path: 'servicios/admin', component: ServiciosAdminComponent },
  { path: 'servicios/admin/nuevo', component: ServicioFormComponent },
  { path: 'servicios/admin/editar/:id', component: ServicioFormComponent },

  { path: 'reservar-tipo/:id', component: ReservarComponent },

  { path: 'reservas/admin', component: ReservasAdminComponent },
  { path: 'reservas/admin/nuevo', component: ReservasFormComponent },
  { path: 'reservas/admin/editar/:id', component: ReservasFormComponent },

  { path: 'operadores/admin', component: OperadoresAdminComponent },
  { path: 'operadores/admin/nuevo', component: OperadoresFormComponent },
  { path: 'operadores/admin/editar/:id', component: OperadoresFormComponent },

  { path: 'menu-admin', component: MenuAdminComponent },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}