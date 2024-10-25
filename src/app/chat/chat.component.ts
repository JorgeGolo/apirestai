import { Component, Input, OnInit } from '@angular/core';
import { ChatgptmiapiService } from '../chatgptmiapi.service';
import { ChatResponsesComponent } from '../chat-responses/chat-responses.component'; // Ajusta la ruta según sea necesario
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { IChat } from '../app.component'; // Asegúrate de importar IChat
import { FirestoreService } from '../services/firestore.service'; // Importar el servicio de Firestore


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ChatResponsesComponent, FormsModule], // Importa el componente aquí
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() chat: IChat | null = null; // Cambia aquí para usar IChat
  @Input() selectedRole: string = ''; // Recibe el rol seleccionado
  @Input() selectedModel: string = ''; // Recibe el modelo seleccionado

  @Input() selectedShortName: string = '';

  currentDate: Date | undefined; 
  roles: string[] = ['Asistente general', 'Asesor técnico', 'Ayuda con tareas'];
  sessionStarted: boolean = false; 
  isConversationActive: boolean = false; // Inicializa la propiedad isConversationActive

  constructor(private chatService: ChatgptmiapiService, private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.currentDate = new Date(); 
  }

  startConversation(role: string): void {
    this.selectedRole = role; 
    this.sessionStarted = true; 
  }
  private async generateMemory(): Promise<string | null> {
    if (!this.chat || this.chat.responses.length === 0) {
        return null;
    }

    // Prepara el historial reciente de mensajes para resumir
    const recentMessages = this.chat.responses.slice(-5).map(response => response.message).join("\n");
    
    // Incluye la memoria existente en el mensaje a resumir
    const messagesToSummarize = this.chat.memory ? `${this.chat.memory}\n${recentMessages}` : recentMessages;

    // Llama a la API de ChatGPT para obtener un resumen
    try {
        const summaryResponse = await this.chatService.generateSummary(messagesToSummarize);
        
        if (!summaryResponse) {
            console.warn('No se obtuvo un resumen válido de la API.');
            return null;
        }

        // Acumula los resúmenes
        if (this.chat.memory) {
            this.chat.memory += `\n${summaryResponse}`; // Concatenar el nuevo resumen al existente
        } else {
            this.chat.memory = summaryResponse; // Si no hay memoria, inicializar con el nuevo resumen
        }

        return this.chat.memory; // Retorna la memoria actualizada
    } catch (error) {
        console.error('Error al generar el resumen con la API:', error);
        return null;
    }
}
  async onSubmit(form: any): Promise<void> {
    console.log("mensaje enviado");
    const message = form.value.message;
  
    // Crear la nueva respuesta
    const newResponse = {
      id: Date.now().toString(), // Genera un ID único basado en la fecha actual
      question: message,
      message: "", // Inicialmente vacío hasta recibir la respuesta
      timestamp: new Date()
    };
  
    // Enviar el mensaje con el rol seleccionado
    this.chatService.sendMessage(message, this.selectedRole, this.selectedModel).subscribe(async response => {
      // Actualizar el contenido de la respuesta
      newResponse.message = response.choices[0].message.content;
  
      if (this.chat) {
        // Añadir la respuesta localmente
        this.chat.responses.push(newResponse);
  
      // Generar la memoria y actualizar el chat
      const memory = await this.generateMemory(); // Llama al método para generar la memoria
      if (memory) {
        this.chat.memory = memory; // Actualiza la memoria del chat
      }
  
      // Actualizar el chat en Firestore con la nueva memoria y respuestas
      this.firestoreService.updateChatResponses(this.chat.id, this.chat.responses, this.chat.memory)
          .then(() => {
              console.log('Respuestas y memoria actualizadas con éxito en Firestore');
          })
          .catch(error => {
              console.error('Error al actualizar respuestas y memoria en Firestore: ', error);
          });
            } else {
        console.error("Chat no definido.");
      }
  
      form.reset(); 
    });
  }
  
}
