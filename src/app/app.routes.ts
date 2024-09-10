import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path:'home', component:HomeComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirigir la ruta raíz a 'login'
    { path: '**', redirectTo: 'home' } // Manejar rutas no encontradas
];
