import { Component, Input, OnInit } from '@angular/core';
import { ChatgptmiapiService } from '../chatgptmiapi.service';
import { ChatResponsesComponent } from '../chat-responses/chat-responses.component'; // Ajusta la ruta según sea necesario
import { FormsModule } from '@angular/forms'; // Asegúrate de importar FormsModule
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { IChat } from '../app.component'; // Asegúrate de importar IChat

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

  currentDate: Date | undefined; 
  roles: string[] = ['Asistente general', 'Asesor técnico', 'Ayuda con tareas'];
  sessionStarted: boolean = false; 
  isConversationActive: boolean = false; // Inicializa la propiedad isConversationActive

  constructor(private chatService: ChatgptmiapiService) {}

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
    // Enviar el mensaje con el rol seleccionado
    this.chatService.sendMessage(message, this.selectedRole, this.selectedModel).subscribe(response => {
      const newResponse = {
        question: message,
        message: response.choices[0].message.content,
        timestamp: new Date()
      };
      
      if (this.chat) {
        this.chat.responses.push(newResponse); // Asegúrate de que las respuestas se agreguen al chat correspondiente
      } else {
        console.error("Chat no definido.");
      }

      form.reset(); 
    });
  }
}
