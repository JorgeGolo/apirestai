import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ChatgptmiapiService } from './chatgptmiapi.service'; // Asegúrate de importar tu servicio
import { ChatResponsesComponent } from './chat-responses/chat-responses.component';
import { ChatComponent } from './chat/chat.component'; // Importa el nuevo componente Chat
import { ChatGeneratorComponent } from './chat-generator/chat-generator.component'; // Importa el componente
import { LoginButtonComponent } from './login-button/login-button.component';
import { ChatListComponent } from './chat-list/chat-list.component'; // Importa el componente

// Definición de la interfaz para la respuesta
export interface IChatResponse {
  message: string;
  timestamp: Date;
  question?: string; // Agregamos la propiedad question como opcional
}

// Definición de la interfaz para el chat
export interface IChat {
  id: number;
  role: string;
  model: string;
  responses: IChatResponse[]; // Incluye la propiedad responses
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatListComponent, LoginButtonComponent, ChatGeneratorComponent, ChatComponent, RouterOutlet, FormsModule, CommonModule, ChatResponsesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Cambiado de styleUrl a styleUrls
})
export class AppComponent {
  chats: IChat[] = []; // Usa la interfaz IChat

  selectedChat: IChat | null = null; // Cambia el tipo a IChat | null

  title = 'apirestai';
  isConversationActive: boolean = false; // Variable para gestionar el estado de la conversación

  constructor(private chatgptService: ChatgptmiapiService) {} // Inyección del servicio

  addChat(newChat: { id: number; role: string; model: string }) {
    // Agrega un nuevo chat inicializando responses como un array vacío
    const chatWithResponses: IChat = {
      id: newChat.id,
      role: newChat.role,
      model: newChat.model,
      responses: [] // Inicializa responses como un array vacío
    };
    
    this.chats.push(chatWithResponses); // Agrega el nuevo chat a la lista
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
  }
}
