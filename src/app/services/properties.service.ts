import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Propiedad } from './propertiesModel';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  private apiUrl = 'http://localhost:8000'; // Cambia esto a la URL base de tu API FastAPI
  // private apiUrl = 'https://inmoys-backend-inmobiliaria-1.onrender.com';

  constructor(private http: HttpClient) {}

  // Obtener todas las propiedades
  getAllProperties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-properties`);
  }


  filteresProperties(params: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/get-public-properties-disponibles`, { params });
  }

  // Obtener propiedades disponibles
  getAllAvailableProperties(params: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-public-properties-disponibles`, {params});
  }

  // Obtener una propiedad por ID
  getPropertyById(propertyId: number): Observable<Propiedad> {
    return this.http.get<Propiedad>(`${this.apiUrl}/get-property/${propertyId}`);
  }

  // Obtener propiedades por SKU similar
  getPropertyBySkuSimilar(sku: string): Observable<Propiedad>{
    return this.http.get<Propiedad>(`${this.apiUrl}/get-public-property-by-sku-similar/${sku}`);
  }

  // Obtener propiedades por tipo de transacción
  getPropertiesByTransactionType(tipoTransaccion: string): Observable<any> {
    const params = new HttpParams().set('tipoTransaccion', tipoTransaccion);
    return this.http.get(`${this.apiUrl}/get-properties-tipo`, { params });
  }
  //Obtener todas las propiedades destacadas
  getPropertiesDestacadas(params: any):Observable<any>{
    return  this.http.get(`${this.apiUrl}/get-public-property-destacadas`, {params});
  }

  // Validar si el SKU existe
  validateSku(sku: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/validar-sku/${sku}`);
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ocurrió un error:', error.error.message);
    } else {
      console.error(`Error de servidor: ${error.status}, ` + `cuerpo: ${error.error}`);
    }
    return throwError('Algo salió mal; por favor intenta de nuevo más tarde.');
  }
}
