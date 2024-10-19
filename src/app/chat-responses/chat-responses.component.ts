import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-chat-responses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-responses.component.html',
  styleUrl: './chat-responses.component.css'
})
export class ChatResponsesComponent {
  @Input() question: string | undefined;
  @Input() response: string | undefined = ''; // Input para recibir la respuesta del chat
  @Input() timestamp: Timestamp | Date | undefined; // Propiedad de entrada para la fecha y hora
  
  getFormattedTimestamp(): Date | string {
    if (this.timestamp) {
      // Si es un Timestamp de Firestore, conviértelo a Date
      if (this.timestamp instanceof Timestamp) {
        return this.timestamp.toDate(); // Convierte a Date
      } else {
        return this.timestamp; // Ya es un objeto Date
      }
    }
    return ''; // Retorna una cadena vacía si no hay timestamp
  }

    // Función para formatear o parsear la respuesta
    getParsedResponse(): string {

      if (!this.response) {
        return ''; // Si no hay respuesta, retorna una cadena vacía
      }
  
      // Escapar caracteres especiales
      let parsedResponse = this.response
      .replace(/</g, '&lt;')  // Convierte '<' en '&lt;'
      .replace(/>/g, '&gt;'); // Convierte '>' en '&gt;'

      // Reemplazar las secciones de código y manejar puntos y aparte
      parsedResponse = parsedResponse
      .replace(/```html/g, '<pre class="p-4 m-2 bg-white rounded-lg overflow-x-auto whitespace-pre max-w-full"><code>') // Inicia el bloque de código
      .replace(/```/g, '</code></pre>') // Cierra el bloque de código
      .replace(/\n\n/g, '<br>') // Convierte saltos dobles en cierre y apertura de párrafos
      .replace(/\n/g, '<br>');      // Convierte saltos simples en <br>



      return parsedResponse;
    }
}