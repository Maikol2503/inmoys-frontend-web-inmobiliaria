
import { NavComponent } from '../nav/nav.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { PropertiesService } from '../services/properties.service';
import { Propiedad } from '../services/propertiesModel';
import { CommonModule } from '@angular/common';
import { Imagen } from '../services/imagesPropertiesModel';

import { register } from 'swiper/element/bundle';
import { TestimonialsService } from '../services/testimonials.service';
import { Testimonials } from '../services/testiminialClientsModels';
import { Router, RouterModule } from '@angular/router';
register()

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements AfterViewInit, OnInit {

  dataProperties:Propiedad[] = []
  dataPropertiesDestacadas:Propiedad[] = []
  filteredProperties: Propiedad[] = [];
  dataTestimonialsClients:Testimonials[] = []
  filterActive = 'todos'
  private baseUrl: string = 'http://127.0.0.1:8000/images/';

  constructor(private services:PropertiesService, private servicesTestimonialsClients:TestimonialsService, private router: Router){}


  ngOnInit(): void {
    this.loadProperties()
    this.loadPropertiesDestacadas()
    this.loadTesmonialsClients()
  }

  private map!: L.Map;

  ngAfterViewInit(): void {
    this.initMap();
  }


  loadProperties(): void {
    this.services.getAllAvailableProperties().subscribe(
      (data) => {
        this.dataProperties = data;
        this.filteredProperties = data; 
        // console.log(this.dataProperties, 'todas las propiedades');
      },
      (error) => {
        console.error('Error loading properties:', error);
      }
    );
  }

  loadPropertiesDestacadas(): void {
    this.services.getPropertiesDestacadas().subscribe(
      (data) => {
        this.dataPropertiesDestacadas = data;
        // console.log(this.dataPropertiesDestacadas, 'todas las propiedades destacadas');
      },
      (error) => {
        console.error('Error loading properties:', error);
      }
    );
  }

  loadTesmonialsClients(){
    this.dataTestimonialsClients = this.servicesTestimonialsClients.getTestimonials()
  }


  filterProperties(transaccion:string){
    this.filterActive = transaccion
    if(transaccion === 'todos'){
      this.filteredProperties = this.dataProperties
    } else{
      // Filtrar las propiedades por tipo
      this.filteredProperties = this.dataProperties.filter(property => property.transaccion === transaccion);
    }
  }


  buscar() {
    const tipoPropiedad = (document.getElementById("tipoPropiedad") as HTMLSelectElement).value;
    const tipoTransaccion = (document.getElementById("tipoTransaccion") as HTMLSelectElement).value;
    const zona = (document.getElementById("zona") as HTMLInputElement).value;

     // Construir los parámetros de la URL solo si tienen valor
     const queryParams: any = {};
    
     if (tipoPropiedad && tipoPropiedad !== 'undefined') {
         queryParams.tipo = tipoPropiedad;
     }
     if (tipoTransaccion && tipoTransaccion !== 'undefined') {
         queryParams.transaccion = tipoTransaccion;
     }
     if (zona && zona !== 'undefined') {
         queryParams.zona = zona;
     }
    
    // Redirigir al componente /browser con los parámetros de búsqueda
    this.router.navigate(['/browser'], { queryParams });
  }


   // Función para obtener la URL completa de la imagen
   getImageUrl(idProperty:any, imagen:Imagen): string {
    return `${this.baseUrl}${idProperty}/${imagen.image_name}`;
  }




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
