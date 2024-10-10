import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importa HttpClient y HttpHeaders
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root' // Esto asegura que el servicio esté disponible en toda la aplicación
})
export class ChatgptmiapiService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) {} // Inyección de HttpClient

  // Método para enviar una solicitud POST a la API
  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}` // Incluye el espacio entre Bearer y la clave API
    });

    const body = {
      model: 'gpt-3.5-turbo', // Especifica el modelo
      messages: [{ role: 'user', content: message }] // Contenido del mensaje
    };

    return this.http.post(this.apiUrl, body, { headers }); // Realiza la solicitud POST
  }
}