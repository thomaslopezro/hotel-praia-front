import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'proyecto-desarrollo-web-angular';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const user = this.authService.getCurrentUser();

    if (user) {

      if (user.rol === 'ADMIN') {
        this.router.navigate(['/habitaciones/admin']);

      } else if (user.rol === 'OPERADOR') {
        this.router.navigate(['/menu-admin']);

      } else if (user.rol === 'CLIENTE') {
        this.router.navigate(['/']);
      }
    }
  }
}