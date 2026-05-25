import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-cancelado',
  templateUrl: './pago-cancelado.component.html'
})
export class PagoCanceladoComponent {
  constructor(private router: Router) {}

  irAlInicio(): void {
    this.router.navigate(['/']);
  }
}
