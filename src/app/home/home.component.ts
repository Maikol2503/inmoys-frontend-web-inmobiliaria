
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
import { MapaComponent } from '../mapa/mapa.component';
import { FooterComponent } from "../footer/footer.component";
import { MailService } from '../services/mail.service';
import { FormsModule } from '@angular/forms';
register()

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent, CommonModule, RouterModule, MapaComponent, FooterComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements  OnInit {

  dataProperties:Propiedad[] = []
  dataPropertiesDestacadas:Propiedad[] = []
  filteredProperties: Propiedad[] = [];
  dataTestimonialsClients:Testimonials[] = []
  filterActive = 'todos'
  enviadoExitosamente = false;
  errorEnvio = false;
  enviando = false; 
  private baseUrl: string = 'http://127.0.0.1:8000/images/';

    
  contact = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    mensaje: ''
  };
  

  constructor(private mailService: MailService, private services:PropertiesService, private servicesTestimonialsClients:TestimonialsService, private router: Router){}


  ngOnInit(): void {
    this.loadProperties()
    this.loadPropertiesDestacadas()
    this.loadTesmonialsClients()
  }

  private map!: L.Map;

  // ngAfterViewInit(): void {
  //   this.initMap();
  // }


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




  // private initMap(): void {
  //   this.map = L.map('map', {
  //     center: [40.417784, -3.700000],
  //     zoom: 13,
  //     dragging: true, // Deshabilitar el arrastre con el ratón al inicio
  //     scrollWheelZoom: false, // Deshabilitar el zoom con la rueda del ratón
  //     touchZoom: true, // Deshabilitar el zoom táctil
  //   });

  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     maxZoom: 19,
  //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //   }).addTo(this.map);

  //   // Definir un icono personalizado
  //   const customIcon = L.icon({
  //     iconUrl: 'https://i.imgur.com/rT2nAN9.png', // Ruta a tu imagen
  //     iconSize: [52, 62], // Tamaño del icono en píxeles
  //     iconAnchor: [16, 32], // Punto de anclaje del icono, en este caso la base del icono
  //     popupAnchor: [0, -32] // Punto donde se abrirá el popup en relación al icono
  //   });

  //   // Crear el marcador con el icono personalizado
  //   const marker = L.marker([40.417784, -3.669548], { icon: customIcon }).addTo(this.map);

  //   // Añadir un popup al marcador
  //   marker.bindPopup('¡Bienvenido a tu futuro hogar!').openPopup();
  // }


  onSubmit(contactForm: any) {
    if (contactForm.valid) {
      const formData = new FormData();
      formData.append('nombre', this.contact.nombre);
      formData.append('apellido', this.contact.apellido);
      formData.append('email', this.contact.email);
      formData.append('telefono', this.contact.telefono);
      formData.append('mensaje', this.contact.mensaje);
      this.enviando = true
      this.enviadoExitosamente = false;
      this.errorEnvio = false;

      this.mailService.sendEmail(formData).subscribe(
        response => {
          this.resetForm()
          this.enviando = false;  // Desactiva el estado de envío
          this.enviadoExitosamente = true;
          this.errorEnvio = false;
        },
        error => {
          this.enviando = false;  // Desactiva el estado de envío
          this.errorEnvio = true;
          this.enviadoExitosamente = false;
          if (error.error) {
            console.error('Detalles del error', error.error);
          }
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }
   
  resetForm(){
    this.contact = {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      mensaje: ''
    };
  }

  PlayAnimateButtonSubmit(){

  }



}
