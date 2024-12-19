import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor(private router: Router) {
    // Reiniciar el desplazamiento al final de la navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
  }
}
