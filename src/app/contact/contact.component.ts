import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { CommonModule } from '@angular/common';
import { MapaComponent } from '../mapa/mapa.component';
import { FooterComponent } from '../footer/footer.component';
import { MailService } from '../services/mail.service';  // Importar el servicio de correo

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, MapaComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  private baseUrlImagesWeb: string = 'http://127.0.0.1:8000/images-for-web/';
  
  enviadoExitosamente = false;
  errorEnvio = false;
  enviando = false; 
  
  contact = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    mensaje: ''
  };
  
  constructor(private mailService: MailService) { }  // Inyectar el MailService
  
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


  // Función para obtener la URL completa de la imagen
  getImageUrl(directory: string, nameImage: string): string {
    return `${this.baseUrlImagesWeb}${directory}/${nameImage}`;
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
