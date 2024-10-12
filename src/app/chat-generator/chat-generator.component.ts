import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component'; // Asegúrate de importar el componente correctamente
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-chat-generator',
  templateUrl: './chat-generator.component.html',
  styleUrls: ['./chat-generator.component.css'],
  standalone: true,
  imports: [ChatComponent, CommonModule, FormsModule], // Asegúrate de importar el componente aquí
})
export class ChatGeneratorComponent {
  chats: { id: number, role: string, model: string }[] = []; // Array para gestionar chats y sus roles
  chatCounter = 0; // Contador de chats creados
  selectedModelName: string = "gpt-3.5-turbo"; // Para almacenar el nombre del modelo seleccionado
  selectedRoleName: string = "Asistente general"; // Para almacenar el nombre del rol seleccionado

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


  addChat() {
    // Aquí puedes manejar la lógica para agregar un nuevo chat
    this.chats.push({
      id: this.chats.length + 1,
      role: this.selectedRoleName,
      model: this.selectedModelName,
      // Añade más propiedades según sea necesario
    });
  }

  // Método para eliminar un chat
  removeChat(chatId: number) {
    this.chats = this.chats.filter(chat => chat.id !== chatId);
  }
}
