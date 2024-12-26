import { Component } from '@angular/core';
import { ModalMenuMobileServiceService } from '../services/modal-menu-mobile-service.service';
import { CommonModule } from '@angular/common';
import {Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navmobile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navmobile.component.html',
  styleUrl: './navmobile.component.css'
})
export class NavmobileComponent {

  isVisible = false;
  private baseUrlImagesWeb: string = 'https://inmoys-backend-inmobiliaria-1.onrender.com/images-for-web/';

  constructor(private modalServices:ModalMenuMobileServiceService , private router:Router ){
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


  redirect(url:string){
    this.closeModal()
    this.router.navigate([url])
  }


}
