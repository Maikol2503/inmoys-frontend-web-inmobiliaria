import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent implements AfterViewInit{

  ngAfterViewInit(): void {
    this.initMap();
  }
  private map!: L.Map;

  private initMap(): void {
    this.map = L.map('map', {
      center: [40.417784, -3.700000],
      zoom: 13,
      dragging: true, // Deshabilitar el arrastre con el ratón al inicio
      scrollWheelZoom: false, // Deshabilitar el zoom con la rueda del ratón
      touchZoom: true, // Deshabilitar el zoom táctil
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Definir un icono personalizado
    const customIcon = L.icon({
      iconUrl: 'https://i.imgur.com/rT2nAN9.png', // Ruta a tu imagen
      iconSize: [52, 62], // Tamaño del icono en píxeles
      iconAnchor: [16, 32], // Punto de anclaje del icono, en este caso la base del icono
      popupAnchor: [0, -32] // Punto donde se abrirá el popup en relación al icono
    });

    // Crear el marcador con el icono personalizado
    const marker = L.marker([40.417784, -3.669548], { icon: customIcon }).addTo(this.map);

    // Añadir un popup al marcador
    marker.bindPopup('¡Bienvenido a tu futuro hogar!').openPopup();
  }

}
