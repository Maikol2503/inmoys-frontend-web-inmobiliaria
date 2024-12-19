import { Component, OnInit,  CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { PropertiesService } from '../services/properties.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Propiedad } from '../services/propertiesModel';
import { FooterComponent } from '../footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MailService } from '../services/mail.service';
import { Location } from '@angular/common';
import { Imagen } from '../services/imagesPropertiesModel';



@Component({
  selector: 'app-property-view',
  standalone: true,
  imports: [CommonModule, FooterComponent,  ReactiveFormsModule, RouterModule],
  templateUrl: './property-view.component.html',
  styleUrl: './property-view.component.css' ,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PropertyViewComponent implements OnInit {

  skuProperty = ''
  esDestacado = ''
  dataProperty?: Propiedad;
  private baseUrlImagesWeb:string= 'http://127.0.0.1:8000/images-for-web/';
  private baseUrl: string = 'http://127.0.0.1:8000/images/';
  thumbsSwiper: any;
  text1: any;
  enviadoExitosamente = false;
  errorEnvio = false;
  enviando = false; 
  imagenes: Imagen[] = []; 
  idDeLaPropiedad:any;
  modalFullScreenActive = false
  selectedImageIndex: number = 0; 
  formulario: FormGroup;

  contact = {
    nombre: '',
    apellido:'',
    email: '',
    telefono: '',
    mensaje: '',
  };
  

  constructor(
    private location: Location,
    private mailService: MailService,
    private servicesProperties: PropertiesService, 
    private route: ActivatedRoute,  
    private router: Router, 
    private fb: FormBuilder) {
    // Inicialización del formulario con campos y validaciones
    this.formulario = this.fb.group({
      nombre: [''],
      apellido: [''],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      mensaje: [''],
      sku: ['']  // SKU de la propiedad (input oculto)
    });
  }

  ngOnInit(): void {
   this.skuProperty = this.route.snapshot.paramMap.get('sku') || ''
   this.getProperty()
  }



  getProperty(){
    this.servicesProperties.getPropertyBySkuSimilar(this.skuProperty).subscribe(
      (data:any)=>{
        this.dataProperty=data[0];
        if (this.dataProperty) {
          this.esDestacado = this.dataProperty.destacado == 1 ? 'destacado' : '';
          this.imagenes = this.dataProperty.image || [];  // Asigna las imágenes si existen
          this.idDeLaPropiedad = this.dataProperty.id_property;  // Asigna el ID de la propiedad
        }
      },
      (error)=>{
        console.error('Error al cargar lapropiedad:', error);
      }
    )
  }



  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.formulario.valid) {
      const formData = new FormData();
      formData.append('nombre', this.contact.nombre);
      formData.append('apellido', this.contact.apellido);
      formData.append('email', this.contact.email);
      formData.append('telefono', this.contact.telefono);
      formData.append('mensaje', this.contact.mensaje);
      formData.append('sku', this.skuProperty)
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
     
      
      // Aquí puedes procesar los datos, enviar a la API, etc.
    } else {
      console.log("Formulario inválido");
    }
  }


  resetForm() {
    this.contact = {
      nombre: '',
      apellido:'',
      email: '',
      telefono: '',
      mensaje: '',
    };
  }


  
  volverPaginaAnterior(): void {
    this.location.back();
  }


  imprimirPagina(): void {
    window.print();
  }

  openModalViewImages(index:number){
    this.selectedImageIndex = index;
    this.modalFullScreenActive = true
  }

  closeModalViewImages(){
    this.modalFullScreenActive = false
  }

  async compartirPagina(): Promise<void> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: 'Consulta esta página que podría interesarte.',
          url: window.location.href
        });
        console.log('Página compartida exitosamente');
      } catch (error) {
        console.error('Error al compartir:', error);
      }
    } else {
      console.log('La funcionalidad de compartir no está disponible en este navegador.');
      alert('La opción de compartir no está disponible en este navegador.');
    }
  }


  getImageUrlWeb(directory: string, nameImage: string): string {
    return `${this.baseUrlImagesWeb}${directory}/${nameImage}`;
  }

  getImageUrl(idProperty:any, imagen_name:any): string {
    return `${this.baseUrl}${idProperty}/${imagen_name}`;

  }
}
