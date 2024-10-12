import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ChatgptmiapiService } from './chatgptmiapi.service'; // Asegúrate de importar tu servicio
import { ChatResponsesComponent } from './chat-responses/chat-responses.component';
import { ChatComponent } from './chat/chat.component'; // Importa el nuevo componente Chat
import { ChatGeneratorComponent } from './chat-generator/chat-generator.component'; // Importa el componente

// Definición de la interfaz
interface IChatResponse {
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatGeneratorComponent, ChatComponent, RouterOutlet, FormsModule, CommonModule, ChatResponsesComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Cambiado de styleUrl a styleUrls
})
export class AppComponent {
  title = 'apirestai';
  responses: IChatResponse[] = []; // Array para almacenar las respuestas y sus fechas
  isConversationActive: boolean = false; // Variable para gestionar el estado de la conversación

  constructor(private chatgptService: ChatgptmiapiService) {} // Inyección del servicio

  // Método para iniciar la conversación
  startConversation() {
    this.isConversationActive = true; // Cambia el estado de la conversación a activo
    this.responses = []; // Limpia las respuestas anteriores si es necesario
  }

  onSubmit(form: any) { // Asegúrate de que el método reciba el formulario
    if (!this.isConversationActive) {
      alert("Por favor, inicia una conversación primero."); // Mensaje si intenta enviar sin iniciar conversación
      return; // Salir del método
    }

    const message = form.value.message; // Obtiene el mensaje del formulario
    const role = form.value.role; // Obtiene el rol del campo oculto
    const model = form.value.model; // Obtiene el modelo del campo oculto
    
    console.log(role + model);

    this.chatgptService.sendMessage(message, role, model).subscribe(response => {
      const newResponse: IChatResponse = {
        message: response.choices[0].message.content,
        timestamp: new Date() // Fecha y hora actuales
      };
      this.responses.push(newResponse); // Agregar al array
    });
  }
}