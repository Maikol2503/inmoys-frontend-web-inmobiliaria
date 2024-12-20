import { CommonModule } from '@angular/common';
import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Imagen } from '../services/imagesPropertiesModel';
import Swiper from 'swiper';
import { PropertiesService } from '../services/properties.service';
import { ActivatedRoute } from '@angular/router';
import { Propiedad } from '../services/propertiesModel';

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

  private baseUrl: string = 'https://inmoys-backend-inmobiliaria-1.onrender.com/images/';
  private baseUrlImagesWeb: string = 'https://inmoys-backend-inmobiliaria-1.onrender.com/images-for-web/';

  imagenes: any = [];
  idProperty:any;
  skuProperty?:string;   
  dataProperty?: Propiedad;
  // @Input() skuProperty?:string; 
  selectedImageIndex: any = 0;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;


  ngOnInit(): void {
    console.log('init')
    this.idProperty= this.route.snapshot.paramMap.get('id') || ''
    this.skuProperty = this.route.snapshot.paramMap.get('sku') || ''
    this.selectedImageIndex = this.route.snapshot.paramMap.get('selectedImageIndex') || 0



    this.propertyServices.getPropertyBySkuSimilar(this.skuProperty).subscribe(
      (data:any)=>{
        this.dataProperty=data;
        if (this.dataProperty) {
          this.imagenes = this.dataProperty.image
          console.log(this.imagenes)
        }
      },
      (error)=>{
        console.error('Error al cargar lapropiedad:', error);
      }
    )

  }

  ngAfterViewInit() {
    this.swiperContainer.nativeElement.swiper.activeIndex = this.selectedImageIndex
  }


  // getImageUrlWeb(directory: string, nameImage: string): string {
  //   return `${this.baseUrlImagesWeb}${directory}/${nameImage}`;
  // }

  getImageUrl(skuProperty: any, nameImage:any): string {
    console.log(`${this.baseUrl}${skuProperty}/${nameImage}`, 'ughuigiughiugouig')
    return `${this.baseUrl}${skuProperty}/${nameImage}`;

  }
}
