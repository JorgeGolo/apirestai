import { Component, EventEmitter, Output, Input  } from '@angular/core';
import { ChatComponent } from '../chat/chat.component'; // Asegúrate de importar el componente correctamente
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatListComponent } from '../chat-list/chat-list.component'; // Asegúrate de importar ChatListComponent

import { FirestoreService } from '../services/firestore.service'; // Importar el servicio de Firestore
import { AuthService } from '../auth.service'; // Asumimos que tienes un servicio para manejar la autenticación
import { IChat, IChatConfig } from '../app.component';


@Component({
  selector: 'app-chat-generator',
  templateUrl: './chat-generator.component.html',
  styleUrls: ['./chat-generator.component.css'],
  standalone: true,
  imports: [ChatListComponent, ChatComponent, CommonModule, FormsModule], // Asegúrate de importar el componente aquí
})
export class ChatGeneratorComponent {
  
  @Input() chatconfigs: IChatConfig[] = []; // Recibe la lista de chats como IChat[]
  @Output() chatConfigLoaded = new EventEmitter<IChatConfig[]>(); // Emite los chats cuando se carguen

  @Output() chatAdded = new EventEmitter<IChat>(); // Asegúrate de que el tipo sea IChat

  chats: IChat[] = []; // Usar la interfaz IChat
  chatCounter = 0; // Contador de chats creados

  selectedChatConfig: string = ""; // Para almacenar el nombre del modelo seleccionado
  selectedModelName: string = ""; // Para almacenar el nombre del modelo seleccionado
  selectedRoleName: string = ""; // Para almacenar el nombre del rol seleccionado
  selectedShortName: string = "";

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

  onConfigChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement; // Aquí hacemos el cast
    const typeShortName = selectElement.value; // Obtén el valor seleccionado
  
    const selectedConfig = this.chatconfigs.find(c => c.typeShortName === typeShortName);
    if (selectedConfig) {
      this.selectedModelName = selectedConfig.model;
      this.selectedRoleName = selectedConfig.role;
      this.selectedShortName = selectedConfig.typeShortName;

          // Agregar logs para verificar si se seleccionan correctamente
    console.log('Config seleccionada:', selectedConfig);
    console.log('Model:', this.selectedModelName);
    console.log('Role:', this.selectedRoleName);
    console.log('Short Name:', this.selectedShortName);
    }
  }
  
  
  

  async ngOnInit() {
    try {
      this.chatconfigs = await this.firestoreService.getChatConfigs(); // Llama al servicio para obtener los chats
      console.log('Configs cargados:', this.chatconfigs);
      
      // Emitir los chats cuando se carguen
      this.chatConfigLoaded.emit(this.chatconfigs);
    } catch (error) {
      console.error('Error al cargar las configs:', error);
    }
  }

  async addChat() {
    const newChatData = {
        role: this.selectedRoleName,
        model: this.selectedModelName,
        shortName: this.selectedShortName,
        responses: [] // Inicializa responses como un array vacío
    };

    try {
      const docRef = await this.firestoreService.addDocument('chats', newChatData); 
      const newChat: IChat = {
        id: docRef.id, // Asigna el ID generado por Firestore
        role: this.selectedRoleName,
        model: this.selectedModelName,
        shortName: this.selectedShortName,
        responses: [] // Inicializa responses como un array vacío
      };
        
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
