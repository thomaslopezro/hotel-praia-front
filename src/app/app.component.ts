import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // El redirect inicial segun rol se hace en LoginComponent (despues del login)
  // y en HomeComponent (cuando un admin/operador abre /).
  // AppComponent NO debe forzar navegacion porque pisa URLs validas como
  // /pago-exitoso, /verificar, /reservar-tipo/:id, etc.
  title = 'proyecto-desarrollo-web-angular';
}