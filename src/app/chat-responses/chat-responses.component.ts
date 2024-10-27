import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { FirestoreService } from '../services/firestore.service';
import { IChatResponse } from '../app.component';

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

  @Input() responseout!: IChatResponse;
  @Input() chatId!: string; // Recibe el id del chat
  @Output() responseDeleted = new EventEmitter<string>(); // Emitir el id de la respuesta eliminada

  constructor(private firestoreService: FirestoreService) {}


  async trashResponse(): Promise<void> {
    try {
      console.log("responseout:", this.responseout);
      console.log("chatId:", this.chatId);
      
      if (!this.responseout || !this.responseout.id) {
        throw new Error("responseout o su id no están definidos");
      }
      await this.firestoreService.deleteResponse(this.chatId, this.responseout.id);
      this.responseDeleted.emit(this.responseout.id); // Emitir el evento de respuesta eliminada
    } catch (error) {
      console.error("Error al eliminar la respuesta:", error);
    }
  }
  ngOnInit(): void {
    console.log("Chat ID recibido:", this.chatId);
  }
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
      .replace(/```html/g, '<pre class="border dark:border-[#dddddd] dark:bg-[#444444] dark:text-[#e0e0e0] p-4 m-2 bg-white rounded-lg overflow-x-auto whitespace-pre max-w-full"><code>') // Inicia el bloque de código
      .replace(/```/g, '</code></pre>') // Cierra el bloque de código
      .replace(/\n\n/g, '<br>') // Convierte saltos dobles en cierre y apertura de párrafos
      .replace(/\n/g, '<br>');      // Convierte saltos simples en <br>



      return parsedResponse;
    }
}