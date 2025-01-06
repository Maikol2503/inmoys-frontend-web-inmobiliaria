import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PropertiesService } from '../services/properties.service';
import { Propiedad } from '../services/propertiesModel';
import { FormsModule } from '@angular/forms'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { register } from 'swiper/element/bundle';
register()
import { Imagen } from '../services/imagesPropertiesModel';

import { firstValueFrom } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-browser',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, FooterComponent],
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css'] ,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class BrowserComponent implements OnInit {
 ab='ab'
  dataProperties: Propiedad[] = [];
  dataProperty?:Propiedad;
  filteredProperties: Propiedad[] = [];
  filterTrasaccionActive = ''
  modalToggleFilterActive = ''
  viewPropertyActive = false
  // private baseUrl: string = 'http://127.0.0.1:8000/images/';
  // private baseUrlImagesWeb:string= 'http://127.0.0.1:8000/images-for-web/';
  private baseUrl: string = 'https://inmoys-backend-inmobiliaria-1.onrender.com/images/';
  private baseUrlImagesWeb: string = 'https://inmoys-backend-inmobiliaria-1.onrender.com/images-for-web/';
  resetSlider = false;
  selectedPropertyId: number | null = null;
  numResults = 0
  page = 1
  limit = 6

  loadinNewPropertiesgActive = false
  isLoading = false
  noMoreProperties = false
  newPropertiesData: any
  mainLoadingActive = true

  // @ViewChild('footer') footer!: ElementRef;
  
  
  // Definir los filtros
  filters = {
    tipo: 'vivienda',
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
    order: 'relevancia',
    estadoInmueble:'',
    limit: this.limit,
    offset: this.page
  };
  
view: any;
text1:0 | undefined;

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




// Escucha el evento de scroll en la ventana
@HostListener('window:scroll', [])
async onWindowScroll(): Promise<void>  {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    // const footerHeight = this.footer.nativeElement.offsetHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      
      this.loadinNewPropertiesgActive = true
      // Verificar si ya estás cargando datos para evitar llamadas duplicadas
      if (this.isLoading || this.noMoreProperties) {
       this.loadinNewPropertiesgActive = false
        return;
      }
  
      this.isLoading = true; // Indicar que se está cargando más contenido
      this.filters.offset += 1;
      const filters = this.cleanFilters(this.filters) 

      this.servicesProperties.filteresProperties(filters).subscribe({
        next: (data: Propiedad[]) => {
          this.newPropertiesData = data
          
          if (this.newPropertiesData.length === 0) {
            this.noMoreProperties = true; // No hay más propiedades para cargar
            console.log('No hay más propiedades disponibles');
            this.loadinNewPropertiesgActive = false
          } else {
            this.dataProperties = [...this.dataProperties, ...this.newPropertiesData];
            this.loadinNewPropertiesgActive = false
          }
        },
        error: (err) => {
          console.error('Error al obtener propiedades', err);
        },
        complete: () => {
          this.isLoading = false; // Finalizar estado de carga
          this.loadinNewPropertiesgActive = false
        }
      });
    }
  }

async checkLoadingState(): Promise<void> {
    if (this.dataProperties.length >= 0) {
        this.mainLoadingActive = false;
    } 
}
  

// Cargar todas las propiedades disponibles
async loadProperties(filters:any): Promise<void>  {
    this.dataProperties = await firstValueFrom(this.servicesProperties.filteresProperties(filters));
    this.numResults = this.dataProperties.length
    this.checkLoadingState()
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
async applyFilter(): Promise<void>  {
    // Limpiar los filtros antes de enviarlos
    this.noMoreProperties = false
    this.filters.offset = 1
    this.dataProperties = []
    this.newPropertiesData = []
    this.mainLoadingActive = true
    const cleanFilters = this.cleanFilters(this.filters);
    await this.loadProperties(cleanFilters); // Cargar propiedades filtradas desde el backend
    this.actualizarUrl(cleanFilters)
}

actualizarUrl(parametros:any){
  this.router.navigate([], { 
    relativeTo: this.route,
    queryParams: parametros,
    queryParamsHandling: 'replace', // Mantiene los parámetros existentes
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
  if(targetElement?.closest('.btn-close-modal')){
      this.modalToggleFilterActive = '';
      return
  } else if (targetElement?.closest('.modal') || targetElement?.closest('.modalPrecio') || targetElement?.closest('.modalTamano') || targetElement?.closest('.mas')) {
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
    tipo: 'vivienda',
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
    order: 'relevancia',
    estadoInmueble:'',
    limit: this.limit,
    offset: this.page
  };
  this.applyFilter()
}

  // Función para obtener la URL completa de la imagen
  getImageUrl(idProperty:any, imagen:Imagen): string {
    return `${this.baseUrl}${idProperty}/${imagen.image}`;
  }

  getImageUrlWeb(directory: string, nameImage: string): string {
    return `${this.baseUrlImagesWeb}${directory}/${nameImage}`;
  }
}
