import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingModule } from './features/landing/landing.module';
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
import { ReservasFormComponent } from './pages/reservas-form/reservas-form.component';
import { ReservasAdminComponent } from './pages/reservas-admin/reservas-admin.component';
import { MenuAdminComponent } from './pages/menu-admin/menu-admin.component';
import { ServiciosCuentaComponent } from './pages/servicios-cuenta/servicios-cuenta.component';
import { AdminNavbarComponent } from './pages/admin-navbar/admin-navbar.component';
import { OperadoresAdminComponent } from './pages/operadores-admin/operadores-admin.component';
import { OperadoresFormComponent } from './pages/operadores-form/operadores-form.component';


@NgModule({
  declarations: [
    AppComponent,
    TiposHabitacionAdminComponent,
    TipoHabitacionFormComponent,
    ServiciosAdminComponent,
    ServicioFormComponent,
    LoginComponent,
    RegistroComponent,
    MiPerfilComponent,
    ServiciosPublicComponent,
    HabitacionesAdminComponent,
    HabitacionesFormComponent,
    ReservarComponent,
    ReservasFormComponent,
    ReservasAdminComponent,
    MenuAdminComponent,
    ServiciosCuentaComponent,
    AdminNavbarComponent,
    OperadoresAdminComponent,
    OperadoresFormComponent
 

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LandingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }