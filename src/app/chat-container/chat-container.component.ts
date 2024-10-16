import { Component, Input } from '@angular/core';
import { IChat } from '../app.component'; // Importa la interfaz IChat desde el componente principal
import { ChatTitleComponent } from '../chat-title/chat-title.component'; // Asegúrate de importar el componente
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar *ngIf, *ngFor, etc.
import { ChatResponsesComponent } from '../chat-responses/chat-responses.component'; // Asegúrate de importar el componente
import { ChatComponent } from '../chat/chat.component'; // Asegúrate de importar el componente

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [ChatComponent, ChatResponsesComponent, CommonModule, ChatTitleComponent],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.css'
})
export class ChatContainerComponent {
  @Input() selectedChat: IChat | null = null;  // Aceptar null

}
