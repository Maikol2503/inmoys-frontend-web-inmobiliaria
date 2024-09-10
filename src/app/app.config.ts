import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
              provideZoneChangeDetection({ eventCoalescing: true }), 
              provideRouter(routes), 
              importProvidersFrom(HttpClientModule), 
              provideHttpClient(withFetch()), provideAnimationsAsync()
             ]
 
};
