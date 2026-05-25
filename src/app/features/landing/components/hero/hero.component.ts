import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Si el usuario esta logueado, baja a la seccion de habitaciones para que
  // pueda escoger una y reservar. Si no, lo manda al login.
  reservarAhora(): void {
    if (this.authService.estaLogueado()) {
      const habitaciones = document.getElementById('habitaciones');
      if (habitaciones) {
        habitaciones.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
