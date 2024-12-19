import { CommonModule } from '@angular/common';
import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Imagen } from '../services/imagesPropertiesModel';
import Swiper from 'swiper';
import { PropertiesService } from '../services/properties.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modal-view-images',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-view-images.component.html',
  styleUrls: ['./modal-view-images.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalViewImagesComponent implements AfterViewInit , OnInit{

  constructor(private route: ActivatedRoute, private propertyServices:PropertiesService){}

  private baseUrlImagesWeb: string = 'http://127.0.0.1:8000/images-for-web/';
  private baseUrl: string = 'http://127.0.0.1:8000/images/';

  imagenes: any = [];
  idProperty:any;
  skuProperty:any;   
  // @Input() skuProperty?:string; 
  selectedImageIndex: any = 0;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

  ngOnInit(): void {
    console.log('init')
    this.idProperty= this.route.snapshot.paramMap.get('id') || ''
    this.skuProperty = this.route.snapshot.paramMap.get('sku') || ''
    this.selectedImageIndex = this.route.snapshot.paramMap.get('selectedImageIndex') || 0
    this.propertyServices.getImagesByPropertyId(this.idProperty).subscribe(
      (imagenes:any)=>{
        this.imagenes = imagenes
        console.log(this.imagenes,'ñojms')
      }
    )
  }

  ngAfterViewInit() {
    this.swiperContainer.nativeElement.swiper.activeIndex = this.selectedImageIndex
  }

  

  
 

  getImageUrlWeb(directory: string, nameImage: string): string {
    return `${this.baseUrlImagesWeb}${directory}/${nameImage}`;
  }

  getImageUrl(idProperty: any, nameImage:any): string {
    console.log(`${this.baseUrl}${idProperty}/${nameImage}`)
    return `${this.baseUrl}${idProperty}/${nameImage}`;

  }
}
