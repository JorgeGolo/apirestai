import { Component,  Input } from '@angular/core';
import { IChat } from '../app.component'; // Importa la interfaz IChat desde el componente principal

@Component({
  selector: 'app-chat-title',
  standalone: true,
  imports: [],
  templateUrl: './chat-title.component.html',
  styleUrl: './chat-title.component.css'
})
export class ChatTitleComponent {
  @Input() selectedShortName: string = '';  // Recibe el nombre corto del chat
  @Input() selectedModel: string = '';  // Recibe el nombre corto del chat
  @Input() selectedRole: string = '';  // Recibe el nombre corto del chat

  @Input() chat!: IChat;  // Añadir esta línea para recibir el chat seleccionado
  

}
