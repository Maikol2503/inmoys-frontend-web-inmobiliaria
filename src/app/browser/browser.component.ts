import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertiesService } from '../services/properties.service';
import { Propiedad } from '../services/propertiesModel';
import { FormsModule } from '@angular/forms'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Imagen } from '../services/imagesPropertiesModel';
register()

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
  filteredProperties: Propiedad[] = [];
  filterTrasaccionActive = ''
  modalFilterActive = ''
  private baseUrl: string = 'http://127.0.0.1:8000/images/';
  
  // Definir los filtros
  filters = {
    tipo: '',
    precioDesde:0,
    precioHasta:0,
    tamanoDesde:0,
    tamanoHasta:0,
    transaccion: 'venta',
    zona: null,
    habitaciones: null,
    banos: null,
    tamano: null,
    garaje: null,
    piscina: null,
    trastero: null,
    order: 'reciente'
  };

  constructor(private servicesProperties: PropertiesService, private route: ActivatedRoute) {}

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
          this.closeModal();
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


  cleanFilters(filters: any): any {
    const cleanedFilters: any = {};
    // Iterar sobre cada clave en los filtros
    for (const key in filters) {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        cleanedFilters[key] = filters[key]; // Agregar solo si no es null o undefined
      }
    }
    console.log(cleanedFilters)
    return cleanedFilters; // Retornar el objeto limpio
  }


 






  // Aplicar los filtros a las propiedades
  applyFilter() {
    // Limpiar los filtros antes de enviarlos
    const cleanFilters = this.cleanFilters(this.filters);
    this.loadProperties(cleanFilters); // Cargar propiedades filtradas desde el backend
    // console.log('Todas las propiedades:', this.dataProperties); 

  }

  applyFilterTipologia(tipo:string){
    this.filters.tipo = tipo
    this.applyFilter()
    setTimeout(() => {
      this.closeModal();
  }, 10); // Espera de 100ms antes de cerrar el modal.
    
  }

  applyFilterTrasaccion(trasaccion:any){
    this.filters.transaccion = trasaccion
    this.applyFilter()
    setTimeout(() => {
      this.closeModal();
  }, 10); // Espera de 100ms antes de cerrar el modal.
  }

  deleteFilterTipologia(event: Event){
    event.stopPropagation(); // Detiene la propagación del evento de clic.
    this.filters.tipo = '';   // Elimina el filtro de tipología.
    this.applyFilter(); 
  }

  openModalFilter(filter: string, event: MouseEvent) {
    // Si el modal activo es el mismo que el clicado, lo cierra
    if (this.modalFilterActive === filter) {
        this.closeModal(event);  // Pasa el evento al cerrar el modal
    } else {
        this.modalFilterActive = filter;  // Abre el nuevo modal
    }
}

closeModal(event?: MouseEvent) {
  // Verifica si el clic proviene de dentro del modal y no lo cierra
  const targetElement = event?.target as HTMLElement;
  
  if (targetElement?.closest('.modal') || targetElement?.closest('.modalPrecio') || targetElement?.closest('.modalTamano')) {
      return;  // No cierra el modal si el clic fue dentro del mismo
  }

  this.modalFilterActive = '';  // Cierra el modal si el clic fue fuera de él
}


  


  // Función para obtener la URL completa de la imagen
  getImageUrl(idProperty:any, imagen:Imagen): string {
    return `${this.baseUrl}${idProperty}/${imagen.image_name}`;
  }
}
