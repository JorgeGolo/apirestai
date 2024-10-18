import { Component, OnInit } from '@angular/core'; 
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ChatgptmiapiService } from './chatgptmiapi.service'; // Asegúrate de importar tu servicio
import { ChatResponsesComponent } from './chat-responses/chat-responses.component';
import { ChatComponent } from './chat/chat.component'; // Importa el nuevo componente Chat
import { ChatGeneratorComponent } from './chat-generator/chat-generator.component'; // Importa el componente
import { LoginButtonComponent } from './login-button/login-button.component';
import { ChatListComponent } from './chat-list/chat-list.component'; // Importa el componente
import { ChatTitleComponent } from './chat-title/chat-title.component'; // Importa el componente
import { FirestoreService } from './services/firestore.service'; // Asegúrate de que la ruta sea correcta
import { NavegationComponent } from './navegation/navegation.component'; // Importa el nuevo componente 
import { ChatContainerComponent } from './chat-container/chat-container.component'; // Importa el nuevo componente 
import { DocumentationComponent } from './documentation/documentation.component';
import { InfoComponent } from './info/info.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment'; // Importa el entorno
import { ChattypeGeneratorComponent } from './chattype-generator/chattype-generator.component';
import { ChattypeListComponent } from './chattype-list/chattype-list.component';

// Definición de la interfaz para la respuesta
export interface IChatResponse {
  id: string; // Usar la fecha como ID
  message: string;
  timestamp: Date;
  question?: string; // Agregamos la propiedad question como opcional
}

// Definición de la interfaz para el chat
export interface IChat {
  id: string; // Cambiar a string
  role: string;
  model: string;
  shortName: string;
  responses: IChatResponse[]; // Incluye la propiedad responses
}

// Definición de la interfaz para el chat
/*export interface IChat {
  id: string; // Cambiar a string
  shortName: string;
  chatconfig: IChatConfig["typeShortName"];
  role: IChatConfig["role"];
  model: IChatConfig["model"];
  responses: IChatResponse[]; // Incluye la propiedad responses
} */

export interface IChatConfig {
  id: string; // Cambiar a string
  role: string;
  model: string;
  typeShortName: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ChattypeListComponent, ChattypeGeneratorComponent, InfoComponent, DocumentationComponent, ChatContainerComponent, NavegationComponent, ChatTitleComponent, ChatListComponent, LoginButtonComponent, ChatGeneratorComponent, ChatComponent, RouterOutlet, FormsModule, CommonModule, ChatResponsesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Cambiado de styleUrl a styleUrls
})

export class AppComponent implements OnInit {
  chats: IChat[] = []; // Usa la interfaz IChat
  chatconfigs: IChatConfig[] = []; // Usa la interfaz IChat

  selectedChat: IChat | null = null; // Cambia el tipo a IChat | null

  title = 'apirestai';
  isConversationActive: boolean = false; // Variable para gestionar el estado de la conversación

  showDocumentation: boolean = false; // Nueva variable para controlar la visibilidad de la documentación
  showInfo: boolean = false; // Nueva variable para controlar la visibilidad de la documentación
  showChattype: boolean = false;
  showChatgen: boolean = false;

  constructor(private chatgptService: ChatgptmiapiService, private firestoreService: FirestoreService) {} // Asegúrate de inyectar el FirestoreService
  
  ngOnInit() {
    this.loadChats(); // Cargar los chats al iniciar
    this.loadChatConfigs(); // Cargar los chats al iniciar
  }

  // Función que se ejecuta cuando los chats se cargan
  onChatLoaded(loadedChats: IChat[]) {
    this.chats = loadedChats; // Asignar los chats cargados
    console.log('Chats recibidos:', this.chats);
  }
  onChatConfigLoaded(loadedChatConfigs: IChatConfig[]) {
    this.chatconfigs = loadedChatConfigs; // Asignar los chats cargados
    console.log('Chats recibidos:', this.chats);
  }
  async loadChats() {
    try {
      // Intenta cargar los chats desde Firestore
      this.chats = await this.firestoreService.getChats();
      console.log('Chats cargados:', this.chats);
  
      // Si no se obtienen chats, puedes agregar un chat temporal por defecto
      if (!this.chats || this.chats.length === 0) {
        console.log('No se encontraron chats, creando uno temporal...');
      }
  
    } catch (error) {
      console.error('Error al cargar los chats desde Firestore:', error);
      // En caso de error, agrega un chat temporal localmente
      // this.addTempChat();
    }
  }

  async loadChatConfigs() {
    try {
      // Intenta cargar los chats desde Firestore
      this.chatconfigs = await this.firestoreService.getChatConfigs();
  
      // Si no se obtienen chats, puedes agregar un chat temporal por defecto
      if (!this.chatconfigs || this.chatconfigs.length === 0) {
        console.log('No se encontraron chats, creando uno temporal...');
      }
  
    } catch (error) {
      console.error('Error al cargar los chats desde Firestore:', error);
      // En caso de error, agrega un chat temporal localmente
      // this.addTempChat();
    }
  }
  
  addChat(newChat: IChat) {
    console.log('Nuevo chat recibido en AppComponent:', newChat);
    this.chats.push(newChat); // Solo agrega el nuevo chat a la lista local
    // Aquí puedes decidir si cargar todos los chats nuevamente o no
  }
  saveChatConfig(newChatConfig: IChatConfig) {
    console.log('Nuevo chat recibido en AppComponent:', newChatConfig);
    this.chatconfigs.push(newChatConfig); // Solo agrega el nuevo chat a la lista local
    // Aquí puedes decidir si cargar todos los chats nuevamente o no
  }

  // Método para iniciar la conversación
  startConversation() {
    this.isConversationActive = true; // Cambia el estado de la conversación a activo
    if (this.selectedChat) {
      this.selectedChat.responses = []; // Limpia las respuestas del chat seleccionado
    }
  }


  onSubmit(form: any) { // Asegúrate de que el método reciba el formulario
    if (!this.isConversationActive || !this.selectedChat) {
      alert("Por favor, inicia una conversación primero."); // Mensaje si intenta enviar sin iniciar conversación
      return; // Salir del método
    }

    const message = form.value.message; // Obtiene el mensaje del formulario
    const role = form.value.role; // Obtiene el rol del campo oculto
    const model = form.value.model; // Obtiene el modelo del campo oculto

    this.chatgptService.sendMessage(message, role, model).subscribe(response => {
      const newResponse: IChatResponse = {
        id: Date.now().toString(), // Genera un ID único para la respuesta
        message: response.choices[0].message.content,
        timestamp: new Date(),
        question: message // Asignar el mensaje como la pregunta
        // Fecha y hora actuales
      };
      this.selectedChat?.responses.push(newResponse); // Agrega la respuesta al chat seleccionado
    });
  }

  onChatSelected(chat: IChat) { // Cambia el tipo de chat a IChat
    // Encuentra el chat seleccionado en la lista de chats
    this.selectedChat = this.chats.find(c => c.id === chat.id) || null; // Asegúrate de que selectedChat tenga la estructura correcta
    this.showDocumentation = false; // Cambiar el estado para mostrar la documentación
    this.showInfo = false; // Cambiar el estado para mostrar la documentación
    this.showChattype = false;
    this.showChatgen = false;
  }
  
  logout() {
    this.selectedChat = null; // Limpia el chat seleccionado
  }

  onDocumentationSelected() {
    this.showDocumentation = true; // Cambiar el estado para mostrar la documentación
    this.showInfo = false; // Cambiar el estado para mostrar la documentación
    this.selectedChat = null; // Ocultar el chat seleccionado
    this.showChattype = false;
    this.showChatgen = false;
  }

  onInfoSelected() {
    this.showInfo = true; // Cambiar el estado para mostrar la documentación
    this.showDocumentation = false; // Cambiar el estado para mostrar la documentación
    this.selectedChat = null; // Ocultar el chat seleccionado
    this.showChattype = false;
    this.showChatgen = false;
  }

  onChattypeSelected() {
    this.showInfo = false; // Cambiar el estado para mostrar la documentación
    this.showDocumentation = false; // Cambiar el estado para mostrar la documentación
    this.selectedChat = null; // Ocultar el chat seleccionado
    this.showChattype = true;
    this.showChatgen = false;
  }

  ongChatSelected() {
    this.showInfo = false; // Cambiar el estado para mostrar la documentación
    this.showDocumentation = false; // Cambiar el estado para mostrar la documentación
    this.selectedChat = null; // Ocultar el chat seleccionado
    this.showChattype = false;
    this.showChatgen = true;
  }

}