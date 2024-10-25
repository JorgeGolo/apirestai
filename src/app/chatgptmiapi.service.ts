import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importa HttpClient y HttpHeaders
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../environments/environment';

const apiKey = environment.apiKey;
// Define una interfaz para la respuesta de la API

interface ChatGPTResponse {
  choices: { message: { content: string } }[]; // Ajusta el tipo según la estructura de la respuesta
}

@Injectable({
  providedIn: 'root' // Esto asegura que el servicio esté disponible en toda la aplicación
})
export class ChatgptmiapiService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) {} // Inyección de HttpClient

  // Método para enviar una solicitud POST a la API
  sendMessage(message: string, role: string, model: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}` // Incluye el espacio entre Bearer y la clave API
    });


    // Prepara el contenido del mensaje
    const body = {
      model: model,
      messages: [
        { role: 'system', content: `${role}` }, // Rol del sistema
        { role: 'user', content: message } // Mensaje del usuario
      ]
    };

    return this.http.post(this.apiUrl, body, { headers }); // Realiza la solicitud POST
  }
  async generateSummary(messages: string): Promise<string | null> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}` // Incluye el espacio entre Bearer y la clave API
    });

    // Prepara el contenido del resumen
    const body = {
      model: "gpt-3.5-turbo", // O el modelo que estés utilizando
      messages: [
        { role: 'user', content: messages } // El mensaje a resumir
      ]
    };

    try {
      const response: ChatGPTResponse = await firstValueFrom(this.http.post<ChatGPTResponse>(this.apiUrl, body, { headers }));
      return response.choices[0].message.content.trim() || null; // Devuelve el contenido del resumen
    } catch (error) {
      console.error('Error al llamar a la API para generar resumen:', error);
      return null;
    }
  }
}