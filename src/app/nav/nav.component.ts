import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  scrolled = false;
  private baseUrlImagesWeb: string = 'https://inmoys-backend-inmobiliaria-1.onrender.com/images-for-web/';
  isNotHome = false;

  constructor(private router: Router) {
    this.checkRoute(); // Verificar la ruta cuando se inicia el componente
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition > 50) { // Puedes ajustar la cantidad de scroll aquí
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }


  }

  // Método para verificar si la URL actual es distinta de 'home'
  private checkRoute() {
    this.router.events.subscribe(() => {
      // Actualiza la variable dependiendo de si la URL actual es distinta de '/home'
      this.isNotHome = this.router.url !== '/home';
    });
  }

  getImageUrlWeb(directory: string, nameImage: string): string {
    return `${this.baseUrlImagesWeb}${directory}/${nameImage}`;
  }
}
