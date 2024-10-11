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

  private roleSystemSent: boolean = false; // Variable para rastrear si el role system ya se envió

  constructor(private http: HttpClient) {} // Inyección de HttpClient

  // Método para enviar una solicitud POST a la API
  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}` // Incluye el espacio entre Bearer y la clave API
    });

    // Prepara el contenido del mensaje
    const messages = [];

    // Agrega el role system solo si aún no se ha enviado
    if (!this.roleSystemSent) {
      messages.push({ role: 'system', content: 'Eres un asistente general que responde a preguntas sobre diversos temas.' }); // Aquí se define el role system
      this.roleSystemSent = true; // Marca que el role system ha sido enviado
    }
    
    // Agrega el mensaje del usuario
    messages.push({ role: 'user', content: message });

    const body = {
      model: 'gpt-3.5-turbo', // Especifica el modelo
      messages: messages // Contenido del mensaje
    };

    return this.http.post(this.apiUrl, body, { headers }); // Realiza la solicitud POST
  }

  // Método para reiniciar la sesión (opcional)
  resetSession(): void {
   this.roleSystemSent = false; // Reinicia el estado para permitir enviar el role system en la siguiente sesión
  }
}