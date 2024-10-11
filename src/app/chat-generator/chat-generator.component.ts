import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component'; // Asegúrate de importar el componente correctamente
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-chat-generator',
  templateUrl: './chat-generator.component.html',
  styleUrls: ['./chat-generator.component.css'],
  standalone: true,
  imports: [ChatComponent, CommonModule], // Asegúrate de importar el componente aquí
})
export class ChatGeneratorComponent {
  chats: number[] = []; // Array para gestionar múltiples chats
  chatCounter = 0; // Contador de chats creados

  // Método para agregar un nuevo chat
  addChat() {
    this.chatCounter++;
    this.chats.push(this.chatCounter);
  }

  // Método para eliminar un chat
  removeChat(chatId: number) {
    this.chats = this.chats.filter(chat => chat !== chatId);
  }
}
