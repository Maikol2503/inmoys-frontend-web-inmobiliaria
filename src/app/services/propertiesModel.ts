import { Imagen } from "./imagesPropertiesModel";

export interface Propiedad {
    id_property?: number;
    sku?: string;
    fecha_creacion?: string;
    titulo: string;
    tipo: string;
    descripcion: string;
    destacado?: number;
    precio: number;
    transaccion: string;
    provincia: string;
    ciudad: string;
    zona: string;
    cp: number;
    puerta: string;
    numeroCalle: number;
    nombreCalle: string;
    planta: number;
    disponibilidad: string;
    detalles: any;
    image: Imagen[];
}
