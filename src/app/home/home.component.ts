
import { NavComponent } from '../nav/nav.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { PropertiesService } from '../services/properties.service';
import { Propiedad } from '../services/propertiesModel';
import { CommonModule } from '@angular/common';
import { Imagen } from '../services/imagesPropertiesModel';


import { TestimonialsService } from '../services/testimonials.service';
import { Testimonials } from '../services/testiminialClientsModels';
import { Router, RouterModule } from '@angular/router';
import { MapaComponent } from '../mapa/mapa.component';
import { FooterComponent } from "../footer/footer.component";
import { MailService } from '../services/mail.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';


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
  esDestacado = ''
  enviadoExitosamente = false;
  errorEnvio = false;
  enviando = false; 
  private baseUrl: string = 'https://inmoys-backend-inmobiliaria-1.onrender.com/images/';
  private baseUrlImagesWeb: string = 'https://inmoys-backend-inmobiliaria-1.onrender.com/images-for-web/';
  mainLoadingActive = true
  page = 1
  limit = 8

  page_destacados = 1
  limit_destacados = 6
    
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


 async loadProperties(): Promise<void>  {
    const params = {
                limit:this.limit,
                offset:this.page
              }

    this.dataProperties = await firstValueFrom(this.services.getAllAvailableProperties(params));
    this.filteredProperties = this.dataProperties;
    this.mainLoadingActive = false
  }

async  loadPropertiesDestacadas(): Promise<void> {
    const params = {
      limit:this.limit_destacados,
      offset:this.page_destacados
    }
    this.dataPropertiesDestacadas = await firstValueFrom(this.services.getPropertiesDestacadas(params));
    
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
    return `${this.baseUrl}${idProperty}/${imagen.image}`;
  }


  getImageUrlWeb(directory: string, nameImage: string): string {
    return `${this.baseUrlImagesWeb}${directory}/${nameImage}`;
  }

  

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




}
