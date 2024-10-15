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
}