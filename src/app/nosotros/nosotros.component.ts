import { Component } from '@angular/core';
import { Imagen } from '../services/imagesPropertiesModel';



@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {

private baseUrl: string = 'http://127.0.0.1:8000/images-for-web/';
 // Función para obtener la URL completa de la imagen
getImageUrl(directory:string, nameImage:string): string {
  return `${this.baseUrl}${directory}/${nameImage}`;
}
}
