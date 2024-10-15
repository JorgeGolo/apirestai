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

  onSubmit(form: any): void {
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
    this.chatService.sendMessage(message, this.selectedRole, this.selectedModel).subscribe(response => {
      // Actualizar el contenido de la respuesta
      newResponse.message = response.choices[0].message.content;
  
      // Verificar el estado del chat antes de proceder
      console.log('Estado del chat:', this.chat);
  
      if (this.chat) {
        // Añadir la respuesta localmente
        this.chat.responses.push(newResponse);
  
        // Actualizar el chat en Firestore
        this.firestoreService.updateChatResponses(this.chat.id, this.chat.responses)
          .then(() => {
            console.log('Respuestas actualizadas con éxito en Firestore');
          })
          .catch(error => {
            console.error('Error al actualizar respuestas en Firestore: ', error);
          });
      } else {
        console.error("Chat no definido.");
      }
  
      form.reset(); 
    });
  }
  
}
