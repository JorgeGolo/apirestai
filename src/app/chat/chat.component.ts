import { Component, Input, OnInit } from '@angular/core';
import { ChatResponsesComponent } from '../chat-responses/chat-responses.component'; // Ajusta la ruta según sea necesario
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { IChat } from '../app.component'; // Asegúrate de importar IChat
import { FirestoreService } from '../services/firestore.service'; // Importar el servicio de Firestore
import { GroqService } from '../services/groq.service';


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

  //constructor(private chatService: ChatgptmiapiService, private firestoreService: FirestoreService) {}

  constructor(private chatService: GroqService, private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.currentDate = new Date(); 
  }

  startConversation(role: string): void {
    this.selectedRole = role; 
    this.sessionStarted = true; 
  }
  private async generateMemory(): Promise<string | null> {
    // Desactivar temporalmente esta función

    

    if (!this.chat || this.chat.responses.length === 0) {
        return null;
    }

    // Captura solo las últimas cinco interacciones de pregunta-respuesta
    const recentMessages = this.chat.responses.slice(-5)
        .map(response => `Pregunta: ${response.question}\nRespuesta: ${response.message}`)
        .join("\n\n");

    // Agregar las interacciones recientes al historial de memoria previo sin duplicar
    const messagesToSummarize = this.chat.memory
        ? `${this.chat.memory}\nInteracciones recientes:\n${recentMessages}`
        : recentMessages;

    try {
        const summaryResponse = await this.chatService.generateSummary(messagesToSummarize);
        if (summaryResponse) {
            this.chat.memory = summaryResponse; // Actualiza la memoria solo con el nuevo resumen
            return this.chat.memory;
        } else {
            console.warn('No se obtuvo un resumen válido de la API.');
            return null;
        }
    } catch (error) {
        console.error('Error al generar el resumen con la API:', error);
        return null;
    }
        
}

async onSubmit(form: any): Promise<void> {
    console.log("Mensaje enviado");
    const message = form.value.message;
  
    // Crear la nueva respuesta con datos iniciales
    const newResponse = {
      id: Date.now().toString(), // ID único basado en la fecha
      question: message,
      message: "", // Inicialmente vacío hasta recibir la respuesta
      timestamp: new Date(),
    };
  
    // Incluir el contexto de la memoria en el mensaje si existe
    const memoryContext = this.chat?.memory
      ? `Contexto previo: ${this.chat.memory}\nPregunta: ${message}`
      : message;
  
    try {
      // Usar await para llamar al servicio
      const responseContent = await this.chatService.sendMessage(
        memoryContext,
        this.selectedModel
      );
  
      // Actualizar el contenido de la respuesta
      newResponse.message = responseContent;
  
      if (this.chat) {
        // Añadir la respuesta localmente
        this.chat.responses.push(newResponse);
  
        // Generar la memoria y actualizar el chat
        const memory = await this.generateMemory(); // Llama al método para generar la memoria
        if (memory) {
          this.chat.memory = memory; // Actualiza la memoria del chat
        } else {
          this.chat.memory = "";
        }
  
        // Actualizar el chat en Firestore con la nueva memoria y respuestas
        await this.firestoreService.updateChatResponses(
          this.chat.id,
          this.chat.responses,
          this.chat.memory
        );
  
        console.log("Respuestas y memoria actualizadas con éxito en Firestore");
      } else {
        console.error("Chat no definido.");
      }
  
      form.reset();
    } catch (error) {
      console.error("Error al enviar mensaje o actualizar respuestas:", error);
    }
  }

}
