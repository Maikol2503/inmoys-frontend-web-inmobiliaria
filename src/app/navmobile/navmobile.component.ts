import { Component } from '@angular/core';
import { ModalMenuMobileServiceService } from '../services/modal-menu-mobile-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navmobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navmobile.component.html',
  styleUrl: './navmobile.component.css'
})
export class NavmobileComponent {

  isVisible = false;
  private baseUrlImagesWeb: string = 'https://inmoys-backend-inmobiliaria-1.onrender.com/images-for-web/';

  constructor(private modalServices:ModalMenuMobileServiceService){
    // modalServices.modalState$.subscribe((state)=>{
    //   this.isVisible = state
    // })
  }

  getImageUrlWeb(directory: string, nameImage: string): string {
    return `${this.baseUrlImagesWeb}${directory}/${nameImage}`;
  }

  openModal(){
    console.log('open')
   this.isVisible = true
  }

  closeModal(){
    this.isVisible = false
  }


}
