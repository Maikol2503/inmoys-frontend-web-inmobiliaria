import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PropertiesService } from '../services/properties.service';
import { Propiedad } from '../services/propertiesModel';
import { FormsModule } from '@angular/forms'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Imagen } from '../services/imagesPropertiesModel';
register()

import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-browser',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css'] ,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class BrowserComponent implements OnInit {

  dataProperties: Propiedad[] = [];
  dataProperty?:Propiedad;
  filteredProperties: Propiedad[] = [];
  filterTrasaccionActive = ''
  modalToggleFilterActive = ''
  viewPropertyActive = false
  private baseUrl: string = 'http://127.0.0.1:8000/images/';
  resetSlider = false;
  selectedPropertyId: number | null = null;
  
  // Definir los filtros
  filters = {
    tipo: '',
    precioDesde:0,
    precioHasta:0,
    tamanoDesde:0,
    tamanoHasta:0,
    habitaciones: 0,
    transaccion: 'venta',
    banos: 0,
    numeroExactoHabitaciones:false,
    numeroExactoBanos:false,
    zona: null,
    garaje: false,
    piscina: false,
    trastero: false,
    jardin: false,
    ascensor: false,
    gimnasio: false,
    aireAcondicionado: false,
    calefaccion: false,
    terraza: false,
    balcon: false,
    order: 'reciente',
    estadoInmueble:''
  };

  constructor(private servicesProperties: PropertiesService, private route: ActivatedRoute,  private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los parámetros de consulta para aplicar los filtros al cargar
    this.route.queryParams.subscribe(params => {
      this.filters.tipo = params['tipo'] || null;
      this.filters.transaccion = params['transaccion'] || 'venta';
      this.filters.zona = params['zona'] || null;
  
      this.applyFilter()
    });
  }

@HostListener('document:click', ['$event'])
clickOutside(event: MouseEvent) {
      const clickedElement = event.target as HTMLElement;
      const modalElements = document.getElementsByClassName('option'); // Seleccionar todos los modales
      let clickedInsideModal = false;
      
      // Verificar si el clic fue dentro de algún modal
      for (let i = 0; i < modalElements.length; i++) {
          if (modalElements[i].contains(clickedElement)) {
              clickedInsideModal = true;
              break;
          }
      }
  
      // Si no fue dentro de un modal, cerrar todos
      if (!clickedInsideModal) {
          this.closeToggleModal();
      }
}
  

// Cargar todas las propiedades disponibles
loadProperties(filters:any) {
    this.servicesProperties.filteresProperties(filters).subscribe(
      (data) => {
        this.dataProperties = data;
        this.filteredProperties = data; // Inicialmente, mostrar todas las propiedades
        
      },
      (error) => {
        console.error('Error al cargar todas las propiedades:', error);
      }
    );
}


 


async viewProperty(idProperty: number | undefined) {
    this.selectedPropertyId = idProperty ?? 0;
    this.viewPropertyActive = true;
    this.resetSlider = false;

    // Esperar un pequeño tiempo y luego volver a mostrar el slider
    setTimeout(() => {
      this.resetSlider = true;
    }, 50);  // 50ms es suficiente para el re-render

    // this.dataProperty = this.getProperty(id)
  
    this.servicesProperties.getPropertyById(this.selectedPropertyId).subscribe(
      (data)=>{
        this.dataProperty = data
      },
      (error)=>{
        console.error('Error al cargar todas las propiedades:', error);
      }
    )
}


// cierro la seccion donde se vizualiza la propiedad seleccionada
closeViewProperty(){
    this.viewPropertyActive = false;
    this.selectedPropertyId = 0
}


cleanFilters(filters: any): any {
    const cleanedFilters: any = {};
    // Iterar sobre cada clave en los filtros
    for (const key in filters) {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        cleanedFilters[key] = filters[key]; // Agregar solo si no es null o undefined
      }
    }
   
    return cleanedFilters; // Retornar el objeto limpio
}


 
// Aplicar los filtros a las propiedades
applyFilter() {
    // Limpiar los filtros antes de enviarlos
    const cleanFilters = this.cleanFilters(this.filters);
    console.log(cleanFilters)
    this.loadProperties(cleanFilters); // Cargar propiedades filtradas desde el backend

    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: cleanFilters,
      queryParamsHandling: 'merge', // Mantiene los parámetros existentes
    });

}


applyFilterTipologia(tipo:string){
    this.filters.tipo = tipo
    this.applyFilter()
    setTimeout(() => {
      this.closeToggleModal();
  }, 10); // Espera de 100ms antes de cerrar el modal.
    
}


applyFilterTrasaccion(trasaccion:any){
  this.filters.transaccion = trasaccion
    this.applyFilter()
    setTimeout(() => {
      this.closeToggleModal();
  }, 10); // Espera de 100ms antes de cerrar el modal.
}


deleteFilterTipologia(event: Event){
  event.stopPropagation(); // Detiene la propagación del evento de clic.
  this.filters.tipo = '';   // Elimina el filtro de tipología.
  this.applyFilter(); 
}



toggleModal(filter: string, event: MouseEvent) {
    // Si el modal activo es el mismo que el clicado, lo cierra
    if (this.modalToggleFilterActive === filter) {
        this.closeToggleModal(event);  // Pasa el evento al cerrar el modal
    } else {
        this.modalToggleFilterActive = filter;  // Abre el nuevo modal
    }
}


closeToggleModal(event?: MouseEvent) {
  // Verifica si el clic proviene de dentro del modal y no lo cierra
  const targetElement = event?.target as HTMLElement;
  
  if (targetElement?.closest('.modal') || targetElement?.closest('.modalPrecio') || targetElement?.closest('.modalTamano') || targetElement?.closest('.mas')) {
      return;  // No cierra el modal si el clic fue dentro del mismo
  }

  this.modalToggleFilterActive = '';  // Cierra el modal si el clic fue fuera de él
}


applyAdditionalFilters(){
  this.applyFilter()
    setTimeout(() => {
      this.closeToggleModal();
  }, 10);
}



numberRoomSelected(numberSelected:number){
  this.filters.habitaciones = numberSelected
  this.applyFilter()
}

numbeBathroomsSelected(numberSelected:number){
  this.filters.banos = numberSelected
  this.applyFilter()
}


resetFilters() {
  this.filters = {
    tipo: '',
    precioDesde: 0,
    precioHasta: 0,
    tamanoDesde: 0,
    tamanoHasta: 0,
    habitaciones: 0,
    transaccion: 'venta',
    banos: 0,
    numeroExactoHabitaciones: false,
    numeroExactoBanos: false,
    zona: null,
    garaje: false,
    piscina: false,
    trastero: false,
    jardin: false,
    ascensor: false,
    gimnasio: false,
    aireAcondicionado: false,
    calefaccion: false,
    terraza: false,
    balcon: false,
    order: 'reciente',
    estadoInmueble:''
  };
  this.applyFilter()
}

  // Función para obtener la URL completa de la imagen
  getImageUrl(idProperty:any, imagen:Imagen): string {
    return `${this.baseUrl}${idProperty}/${imagen.image_name}`;
  }
}
