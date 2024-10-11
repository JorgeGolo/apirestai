import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-responses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-responses.component.html',
  styleUrl: './chat-responses.component.css'
})
export class ChatResponsesComponent {
  @Input() response: string | undefined = ''; // Input para recibir la respuesta del chat
}
