import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Propiedad } from './propertiesModel';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  private apiUrl = 'http://localhost:8000'; // Cambia esto a la URL base de tu API FastAPI

  constructor(private http: HttpClient) {}

  // Obtener todas las propiedades
  getAllProperties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-properties`);
  }


  filteresProperties(params: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/get-public-properties-disponibles`, { params });
  }

  // Obtener propiedades disponibles
  getAllAvailableProperties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-public-properties-disponibles`);
  }

  // Obtener una propiedad por ID
  getPropertyById(propertyId: number): Observable<Propiedad> {
    return this.http.get<Propiedad>(`${this.apiUrl}/get-property/${propertyId}`);
  }

  // Obtener propiedades por SKU similar
  getPropertyBySkuSimilar(sku: string): Observable<Propiedad>{
    return this.http.get<Propiedad>(`${this.apiUrl}/get-property-by-sku-similar/${sku}`);
  }

  // Obtener propiedades por tipo de transacción
  getPropertiesByTransactionType(tipoTransaccion: string): Observable<any> {
    const params = new HttpParams().set('tipoTransaccion', tipoTransaccion);
    return this.http.get(`${this.apiUrl}/get-properties-tipo`, { params });
  }
  //Obtener todas las propiedades destacadas
  getPropertiesDestacadas():Observable<any>{
    return  this.http.get(`${this.apiUrl}/get-public-property-destacadas`);
  }

  // Validar si el SKU existe
  validateSku(sku: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/validar-sku/${sku}`);
  }
}
