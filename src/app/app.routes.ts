import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BrowserComponent } from './browser/browser.component';
import { PropertyViewComponent } from './property-view/property-view.component';
import { ContactComponent } from './contact/contact.component';
import { NosotrosComponent } from './nosotros/nosotros.component';

export const routes: Routes = [
    {path:'home', component:HomeComponent},
    {path:'contact', component:ContactComponent},
    {path:'nosotros', component:NosotrosComponent},
    {path:'browser', component:BrowserComponent},
    {path:'propiedad/:sku', component:PropertyViewComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirigir la ruta raíz a 'login'
    { path: '**', redirectTo: 'home' } // Manejar rutas no encontradas
];
