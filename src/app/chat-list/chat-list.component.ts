import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent {
  @Input() chats: { id: number, role: string, model: string }[] = []; // Recibe la lista de chats
  @Output() chatSelected = new EventEmitter<{ id: number; role: string; model: string }>();

  selectChat(chat: { id: number; role: string; model: string }) {
    this.chatSelected.emit(chat); // Emitir el chat seleccionado
  }
}
