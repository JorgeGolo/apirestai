import { Component, EventEmitter, Output  } from '@angular/core';
import { ChatComponent } from '../chat/chat.component'; // Asegúrate de importar el componente correctamente
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatListComponent } from '../chat-list/chat-list.component'; // Asegúrate de importar ChatListComponent

import { FirestoreService } from '../services/firestore.service'; // Importar el servicio de Firestore
import { AuthService } from '../auth.service'; // Asumimos que tienes un servicio para manejar la autenticación

@Component({
  selector: 'app-chat-generator',
  templateUrl: './chat-generator.component.html',
  styleUrls: ['./chat-generator.component.css'],
  standalone: true,
  imports: [ChatListComponent, ChatComponent, CommonModule, FormsModule], // Asegúrate de importar el componente aquí
})
export class ChatGeneratorComponent {
  
  @Output() chatAdded = new EventEmitter<{ id: number, role: string, model: string, shortName : string }>(); // Emisor para agregar chats

  chats: { id: number, role: string, model: string, shortName: string }[] = []; // Array para gestionar chats y sus roles
  chatCounter = 0; // Contador de chats creados
  selectedModelName: string = "gpt-3.5-turbo"; // Para almacenar el nombre del modelo seleccionado
  selectedRoleName: string = "Asistente general"; // Para almacenar el nombre del rol seleccionado
  selectedShortName: string = "Nuevo Chat";

  rolesystem = [
    { id: 0, name: 'Asistente general' },
    { id: 1, name: 'Dime una receta que incluya este ingrediente' },
    { id: 2, name: 'Traduce todo lo que te diga al inglés' },
    // Agrega más roles según sea necesario
  ];

  models = [
    { id: 0, name: 'gpt-3.5-turbo' },  // Modelo económico y rápido, adecuado para muchas tareas generales
    { id: 1, name: 'gpt-3.5-turbo-16k' },  // Modelo con un contexto mayor, ideal para tareas más largas
    { id: 2, name: 'gpt-4' },  // Modelo más avanzado, pero más costoso que gpt-3.5
  ];

  constructor(private firestoreService: FirestoreService, private authService: AuthService) { }

  addChat() {
    const newChat = {
      id: this.chatCounter + 1,
      role: this.selectedRoleName,
      model: this.selectedModelName,
      shortName: this.selectedShortName,
    };
    this.chatAdded.emit(newChat); // Emitir el nuevo chat
    this.chatCounter++; // Incrementar el contador

    const userId = this.authService.getCurrentUserId();

    // Añadir el chat a Firestore
    this.firestoreService.addDocument('chats', newChat)
      .then(() => {
        console.log('Chat añadido con éxito');
        this.chats.push(newChat); // Añadir a la lista local de chats
      })
      .catch((error) => {
        console.error('Error al añadir el chat: ', error);
      });
      
    }
  // Método para eliminar un chat
  removeChat(chatId: number) {
    this.chats = this.chats.filter(chat => chat.id !== chatId);
  }



  
}
