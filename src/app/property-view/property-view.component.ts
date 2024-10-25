import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../services/properties.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Propiedad } from '../services/propertiesModel';

@Component({
  selector: 'app-property-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-view.component.html',
  styleUrl: './property-view.component.css'
})
export class PropertyViewComponent implements OnInit {

  skuProperty = ''
  dataProperty?:Propiedad;

  constructor(private servicesProperties: PropertiesService, private route: ActivatedRoute,  private router: Router) {}

  ngOnInit(): void {
   this.skuProperty = this.route.snapshot.paramMap.get('sku') || ''
   this.getProperty()
  }

  getProperty(){
    this.servicesProperties.getPropertyBySkuSimilar(this.skuProperty).subscribe(
      (data)=>{
        this.dataProperty=data;
        console.log(this.dataProperty, 'data')
      },
      (error)=>{
        console.error('Error al cargar lapropiedad:', error);
      }
    )
  }

}
