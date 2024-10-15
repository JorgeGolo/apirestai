import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore'; // Importa Timestamp desde Firestore

@Component({
  selector: 'app-chat-responses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-responses.component.html',
  styleUrls: ['./chat-responses.component.css'] // Asegúrate de que el nombre sea 'styleUrls'
})
export class ChatResponsesComponent implements OnInit {
  @Input() question: string | undefined;
  @Input() response: string | undefined = ''; // Input para recibir la respuesta del chat
  @Input() timestamp: Timestamp | null = null; // Cambia esto para recibir el Timestamp

  formattedTimestamp: Date | null = null;

  ngOnInit() {
    // Verifica si hay un timestamp y conviértelo a Date
    if (this.timestamp) {
      this.formattedTimestamp = this.convertTimestampToDate(this.timestamp);
    }
  }

  convertTimestampToDate(timestamp: Timestamp): Date {
    return timestamp.toDate(); // Convierte Timestamp a Date
  }
}
