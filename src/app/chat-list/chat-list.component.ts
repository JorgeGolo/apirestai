import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IChat } from '../app.component'; // Importa la interfaz IChat desde el componente principal

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent {
  @Input() chats: IChat[] = []; // Recibe la lista de chats como IChat[]
  @Output() chatSelected = new EventEmitter<IChat>(); // Emite un IChat

  selectChat(chat: IChat) {
    this.chatSelected.emit(chat); // Emitir el chat seleccionado
  }
}