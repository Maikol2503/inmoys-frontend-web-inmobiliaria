import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {

  constructor() { }

  testimoniosClientes = [
    {
      name: 'Ana',
      lastName: 'Fernández',
      tipoCliente: 'Comprador',
      comment: 'Estoy muy satisfecha con el servicio. La atención fue rápida y el resultado superó mis expectativas.',
      image:'https://i.imgur.com/d345wpt.jpeg'
    },
    {
      name: 'Lucía',
      lastName: 'Gómez',
      tipoCliente: 'Vendedor',
      comment: 'Excelente experiencia. El equipo es muy profesional y siempre están dispuestos a ayudar.',
      image:'https://i.imgur.com/UqBY26C.jpeg'
    },
    {
      name: 'Valeria',
      lastName: 'Morales',
      tipoCliente: 'Vendedor',
      comment: 'El servicio al cliente es impecable. Nos ofrecieron soluciones a medida para nuestro negocio.',
      image:'https://i.imgur.com/WeseBdr.jpeg'
    },
    {
      name: 'Camila',
      lastName: 'Sánchez',
      tipoCliente: 'Comprador',
      comment: 'Muy contenta con la calidad y rapidez del servicio. Definitivamente recomendaría esta empresa.',
      image:'https://i.imgur.com/BEZyqQl.jpeg'
    }
  ];

  getTestimonials(){
    return this.testimoniosClientes
  }
  
}
