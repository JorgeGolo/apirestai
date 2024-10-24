import { Component, EventEmitter, Output, Input  } from '@angular/core';
import { ChatComponent } from '../chat/chat.component'; // Asegúrate de importar el componente correctamente
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatListComponent } from '../chat-list/chat-list.component'; // Asegúrate de importar ChatListComponent

import { FirestoreService } from '../services/firestore.service'; // Importar el servicio de Firestore
import { AuthService } from '../services/auth.service'; // Asumimos que tienes un servicio para manejar la autenticación
import { IChat } from '../app.component';


@Component({
  selector: 'app-chat-generator',
  templateUrl: './chat-generator.component.html',
  styleUrls: ['./chat-generator.component.css'],
  standalone: true,
  imports: [ChatListComponent, ChatComponent, CommonModule, FormsModule], // Asegúrate de importar el componente aquí
})
export class ChatGeneratorComponent {
  

  @Output() chatAdded = new EventEmitter<IChat>(); // Asegúrate de que el tipo sea IChat

  chats: IChat[] = []; // Usar la interfaz IChat
  chatCounter = 0; // Contador de chats creados

  selectedChatConfig: string = ""; // Para almacenar el nombre del modelo seleccionado
  selectedModelName: string = ""; // Para almacenar el nombre del modelo seleccionado
  selectedRoleName: string = ""; // Para almacenar el nombre del rol seleccionado
  selectedShortName: string = "";

  onclicksubmit: boolean = false;


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

  
  async ngOnInit() {
    this.onclicksubmit = false;
  }

  async addChat() {
    this.onclicksubmit = true;

    if (!this.selectedModelName) {

      console.error('Por favor, selecciona una configuración válida.');
      //alert('Por favor, selecciona una configuración válida.');
      return; // Evita que se procese si no hay configuración seleccionada
      this.onclicksubmit = true;
    }

    const userId = this.authService.getCurrentUserId() || undefined; // Obtén el ID del usuario logueado

    const newChatData = {
        role: this.selectedRoleName,
        model: this.selectedModelName,
        shortName: this.selectedShortName,
        responses: [] // Inicializa responses como un array vacío
    };

    try {
      const docRef = await this.firestoreService.addDocument('chats', newChatData, userId); 

      const newChat: IChat = {
        id: docRef.id, // Asigna el ID generado por Firestore
        userId : userId,
        role: this.selectedRoleName,
        model: this.selectedModelName,
        shortName: this.selectedShortName,
        responses: [] // Inicializa responses como un array vacío
      };
      console.log(this.selectedChatConfig);
        
        this.chatAdded.emit(newChat); // Emitir el nuevo chat
        this.chatCounter++; // Incrementar el contador

        // Actualiza la lista local de chats
        this.chats.push(newChat); 

        // (Opcional) Obtén todos los chats si es necesario
        this.chats = await this.firestoreService.getChats(); 

    } catch (error) {
        console.error('Error al añadir el chat logueado: ', error);
        const newChat: IChat = {
          id: Date.now().toString(), // Asigna un ID único basado en la fecha actual
          userId : "",
          role: this.selectedRoleName,
          model: this.selectedModelName,
          shortName: this.selectedShortName,
          responses: [] // Inicializa responses como un array vacío
      };
      
      this.chatAdded.emit(newChat); // Emitir el nuevo chat
      this.chatCounter++; // Incrementar el contador

      // Actualiza la lista local de chats
      this.chats.push(newChat); 
    }
}

  
}
