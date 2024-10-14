import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Configuración de la aplicación (si es necesario)
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { environment } from './environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// Bootstrap de la aplicación Angular
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Proporciona HttpClient
    provideFirebaseApp(() => initializeApp(environment.firebase)), // Inicializa Firebase
    provideAuth(() => getAuth()), // Proporciona el servicio de autenticación
    provideFirestore(() => getFirestore()), // Proporciona el servicio de Firestore
  ],
}).catch((err) => console.error(err)); // Captura errores durante el inicio