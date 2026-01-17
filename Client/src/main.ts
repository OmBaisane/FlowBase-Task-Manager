import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Tumhare routes
import { provideHttpClient } from '@angular/common/http'; // API Call ke liye zaroori

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),       // Navigation System ON
    provideHttpClient()          // Internet/API System ON
  ]
}).catch((err) => console.error(err));